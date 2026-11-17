import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useDataHandler from "@/hooks/useDataHandler";
import useHasPermission from "@/hooks/useHasPermission";
import handleRequest from "@/utils/helpers/handle-request";
import { formatCurrency } from "@/utils/helpers/format-currency";
import { formatDate, formatDateAndTime } from "@/utils/helpers/date-formaters";
import AdminLayoutBox from "@/components/ui/admin-layout-box";
import paths from "@/utils/constants/paths";
import resources from "@/utils/constants/resources";
import actions from "@/utils/constants/actions";
import { solidIcons, outlineIcons } from "@/components/icons";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import StatTile from "./_components/stat-tile";
import QuickNavCard from "./_components/quick-nav-card";

const HOME = `${paths.admin}/${paths.home}`;

type PaginatedCountResponse = { paginationResult?: { numberOfPages?: number } };
type RecentOrderListItem = {
  _id: string;
  code?: string;
  totalAmount: number;
  createdAt: string;
  customer?: { name?: string };
  vendor?: { name?: string };
};

type DashboardStats = {
  salesOrdersCount: number;
  purchaseOrdersCount: number;
  vendorsCount: number;
  customersCount: number;
  productsCount: number;
  lowStockCount: number;
  salesThisMonth: { totalRevenue: number; totalOrders: number; pendingPayments: number };
  cashBalance: number;
  recentActivity: Array<{
    id: string;
    kind: "sale" | "purchase";
    code?: string;
    partyName: string;
    amount: number;
    createdAt: string;
    to: string;
  }>;
};

// Keyed by the same stat name as DashboardStats, minus recentActivity (which has its own
// loading/empty handling) - lets each tile independently show "unavailable" instead of one failed
// request blanking the whole dashboard (Phase 4/5 requirement).
type StatKey = Exclude<keyof DashboardStats, "recentActivity">;

export default function Home() {
  const { translate, translations, language } = useLanguage();
  const { user } = useUser();

  useDocumentTitle(`${translations.pages.home} | ${translations.adminPanel}`);

  const canICreateSalesOrders = useHasPermission(resources.salesOrders, actions.create);
  const canICreatePurchaseOrders = useHasPermission(resources.purchaseOrders, actions.create);
  const canICreateProducts = useHasPermission(resources.products, actions.create);
  const canICreateVendors = useHasPermission(resources.vendors, actions.create);
  const canICreateCustomers = useHasPermission(resources.customers, actions.create);

  const canIReadVendors = useHasPermission(resources.vendors, actions.read);
  const canIReadPurchaseOrders = useHasPermission(resources.purchaseOrders, actions.read);
  const canIReadProducts = useHasPermission(resources.products, actions.read);
  const canIReadWarehouses = useHasPermission(resources.warehouses, actions.read);
  const canIReadTransfers = useHasPermission(resources.transfers, actions.read);
  const canIReadReports = useHasPermission(resources.reports, actions.read);
  const canIReadAnalytics = useHasPermission(resources.analytics, actions.read);
  const canIReadCash = useHasPermission(resources.cash, actions.read);

  const { privateRequest, loading, setLoading, error, setError, data, setData } = useDataHandler<DashboardStats | null>({
    initialData: null,
    initialLoading: true,
  });

  // Per-tile availability - a stat that failed to load (or whose request is still pending) stays
  // "unavailable"/"loading" without ever throwing the whole page into an error state, since the
  // 8-ish independent requests below are fetched with Promise.allSettled, not Promise.all.
  const [failedStats, setFailedStats] = useState<Set<StatKey>>(new Set());

  function handleLoadData() {
    const controller = new AbortController();
    const canceled = { current: false };

    const executeFetch = async () => {
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Each "count" request uses `limit: 1` - the list endpoint's own pagination math
      // (`numberOfPages = Math.ceil(totalCount / limit)`) becomes an EXACT total count when limit
      // is 1, without fetching every document. Reuses handlersFactory.js#getAll's existing
      // response shape as-is (no new backend route), and stays cheap regardless of collection size.
      const results = await Promise.allSettled([
        privateRequest({ url: "sale-orders", params: { limit: 1 }, signal: controller.signal, language }),
        privateRequest({ url: "purchaseOrder", params: { limit: 1 }, signal: controller.signal, language }),
        privateRequest({ url: "vendors", params: { limit: 1 }, signal: controller.signal, language }),
        privateRequest({ url: "customers", params: { limit: 1 }, signal: controller.signal, language }),
        privateRequest({ url: "products", params: { limit: 1 }, signal: controller.signal, language }),
        privateRequest({ url: "analytics/inventory-status", signal: controller.signal, language }),
        privateRequest({
          url: "analytics/order-statistics",
          params: { startDate: firstOfMonth.toISOString(), endDate: now.toISOString() },
          signal: controller.signal,
          language,
        }),
        privateRequest({ url: "analytics/warehouses-balance", signal: controller.signal, language }),
        privateRequest({ url: "sale-orders", params: { limit: 5 }, signal: controller.signal, language }),
        privateRequest({ url: "purchaseOrder", params: { limit: 5 }, signal: controller.signal, language }),
      ]);

      const [
        salesOrdersCountRes,
        purchaseOrdersCountRes,
        vendorsCountRes,
        customersCountRes,
        productsCountRes,
        inventoryStatusRes,
        orderStatisticsRes,
        warehousesBalanceRes,
        recentSalesOrdersRes,
        recentPurchaseOrdersRes,
      ] = results;

      const newFailed = new Set<StatKey>();
      const value = <T,>(res: PromiseSettledResult<T>): T | null => (res.status === "fulfilled" ? res.value : null);

      const salesOrdersCount = value<PaginatedCountResponse>(salesOrdersCountRes)?.paginationResult?.numberOfPages;
      if (salesOrdersCount == null) newFailed.add("salesOrdersCount");

      const purchaseOrdersCount = value<PaginatedCountResponse>(purchaseOrdersCountRes)?.paginationResult?.numberOfPages;
      if (purchaseOrdersCount == null) newFailed.add("purchaseOrdersCount");

      const vendorsCount = value<PaginatedCountResponse>(vendorsCountRes)?.paginationResult?.numberOfPages;
      if (vendorsCount == null) newFailed.add("vendorsCount");

      const customersCount = value<PaginatedCountResponse>(customersCountRes)?.paginationResult?.numberOfPages;
      if (customersCount == null) newFailed.add("customersCount");

      const productsCount = value<PaginatedCountResponse>(productsCountRes)?.paginationResult?.numberOfPages;
      if (productsCount == null) newFailed.add("productsCount");

      const inventoryStatus = value<{ data: Array<{ totalStock: number }> }>(inventoryStatusRes);
      const lowStockCount = inventoryStatus ? inventoryStatus.data.filter((p) => p.totalStock <= 5).length : null;
      if (lowStockCount == null) newFailed.add("lowStockCount");

      const orderStatistics = value<{
        data: { orderStats: { totalRevenue: number; totalOrders: number; pendingPayments: number } };
      }>(orderStatisticsRes);
      const salesThisMonth = orderStatistics
        ? {
            totalRevenue: orderStatistics.data.orderStats.totalRevenue || 0,
            totalOrders: orderStatistics.data.orderStats.totalOrders || 0,
            pendingPayments: orderStatistics.data.orderStats.pendingPayments || 0,
          }
        : null;
      if (salesThisMonth == null) newFailed.add("salesThisMonth");

      const warehousesBalance = value<{ data: { totalBalance: number } }>(warehousesBalanceRes);
      const cashBalance = warehousesBalance ? warehousesBalance.data.totalBalance : null;
      if (cashBalance == null) newFailed.add("cashBalance");

      const recentSalesOrders = value<{ data: RecentOrderListItem[] }>(recentSalesOrdersRes);
      const recentPurchaseOrders = value<{ data: RecentOrderListItem[] }>(recentPurchaseOrdersRes);

      const recentActivity = [
        ...(recentSalesOrders?.data || []).map((order) => ({
          id: order._id,
          kind: "sale" as const,
          code: order.code,
          partyName: order.customer?.name || translate("Customer", "عميل"),
          amount: order.totalAmount,
          createdAt: order.createdAt,
          to: `${HOME}/${paths.salesOrders}/${order._id}`,
        })),
        ...(recentPurchaseOrders?.data || []).map((order) => ({
          id: order._id,
          kind: "purchase" as const,
          code: order.code,
          partyName: order.vendor?.name || translate("Vendor", "بائع"),
          amount: order.totalAmount,
          createdAt: order.createdAt,
          to: `${HOME}/${paths.purchaseOrders}/${order._id}`,
        })),
      ]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 6);

      setFailedStats(newFailed);
      setData({
        salesOrdersCount: salesOrdersCount || 0,
        purchaseOrdersCount: purchaseOrdersCount || 0,
        vendorsCount: vendorsCount || 0,
        customersCount: customersCount || 0,
        productsCount: productsCount || 0,
        lowStockCount: lowStockCount || 0,
        salesThisMonth: salesThisMonth || { totalRevenue: 0, totalOrders: 0, pendingPayments: 0 },
        cashBalance: cashBalance || 0,
        recentActivity,
      });
    };

    handleRequest(language, setLoading, setError, executeFetch, canceled);

    return () => {
      controller.abort();
      canceled.current = true;
    };
  }

  useEffect(() => {
    const cancelRequest = handleLoadData();
    return cancelRequest;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const quickActions = [
    canICreateSalesOrders && {
      to: `${HOME}/${paths.salesOrders}/${paths.new}`,
      label: translate("Create Sales Order", "إنشاء طلب بيع"),
    },
    canICreatePurchaseOrders && {
      to: `${HOME}/${paths.purchaseOrders}/${paths.new}`,
      label: translate("Create Purchase Order", "إنشاء طلب شراء"),
    },
    canICreateProducts && {
      to: `${HOME}/${paths.products}/${paths.new}`,
      label: translate("Create Product", "إنشاء منتج"),
    },
    canICreateVendors && { to: `${HOME}/${paths.vendors}`, label: translate("Add Vendor", "إضافة بائع") },
    canICreateCustomers && { to: `${HOME}/${paths.customers}`, label: translate("Add Customer", "إضافة عميل") },
  ].filter(Boolean) as { to: string; label: string }[];

  const quickNavCards = [
    { to: `${HOME}/${paths.salesOrders}`, Icon: outlineIcons.ShoppingCart, title: translations.pages.salesOrders, show: true },
    {
      to: `${HOME}/${paths.purchaseOrders}`,
      Icon: outlineIcons.ShoppingBag,
      title: translations.pages.purchaseOrders,
      show: canIReadPurchaseOrders,
    },
    { to: `${HOME}/${paths.products}`, Icon: outlineIcons.Squares, title: translations.pages.products, show: canIReadProducts },
    { to: `${HOME}/${paths.customers}`, Icon: outlineIcons.Users, title: translations.pages.customers, show: true },
    { to: `${HOME}/${paths.vendors}`, Icon: outlineIcons.Building, title: translations.pages.vendors, show: canIReadVendors },
    {
      to: `${HOME}/${paths.warehouses}`,
      Icon: solidIcons.Building,
      title: translations.pages.warehouses,
      show: canIReadWarehouses,
    },
    { to: `${HOME}/${paths.transfers}`, Icon: outlineIcons.ArrowDownOnSquare, title: translations.pages.transfers, show: canIReadTransfers },
    { to: paths.reports, Icon: outlineIcons.ChartBar, title: translations.pages.reports, show: canIReadReports },
    { to: paths.analytics, Icon: outlineIcons.Analytics, title: translations.pages.analytics, show: canIReadAnalytics },
    { to: paths.cash, Icon: outlineIcons.DollarSign, title: translations.pages.cash, show: canIReadCash },
  ].filter((card) => card.show);

  return (
    <div className="flex flex-col gap-4">
      {/* Welcome / Overview */}
      <AdminLayoutBox>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1>{translate(`Welcome, ${user?.name || ""}`, `مرحبًا، ${user?.name || ""}`)}</h1>
            <p className="text-sm text-gray-600">{formatDate(new Date(), language)}</p>
            <p className="text-sm text-gray-500">
              {translate(
                "Here's a quick overview of what's happening across the system.",
                "فيما يلي نظرة سريعة على ما يحدث في النظام.",
              )}
            </p>
          </div>
          {quickActions.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button key={action.to} component={Link} to={action.to} variant="light" leftSection={<solidIcons.Plus />}>
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </AdminLayoutBox>

      {/* Statistics Overview */}
      <AdminLayoutBox header={{ title: translate("Overview", "نظرة عامة") }}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile
            icon={outlineIcons.ShoppingCart}
            label={translate("Sales Orders", "طلبات البيع")}
            value={data?.salesOrdersCount}
            loading={loading}
            unavailable={failedStats.has("salesOrdersCount")}
            to={`${HOME}/${paths.salesOrders}`}
          />
          <StatTile
            icon={outlineIcons.DollarSign}
            label={translate("Sales This Month", "مبيعات هذا الشهر")}
            value={data && formatCurrency(data.salesThisMonth.totalRevenue, language)}
            loading={loading}
            unavailable={failedStats.has("salesThisMonth")}
          />
          <StatTile
            icon={outlineIcons.ExclamationCircle}
            label={translate("Pending Payments (This Month)", "مدفوعات معلقة (هذا الشهر)")}
            value={data && formatCurrency(data.salesThisMonth.pendingPayments, language)}
            loading={loading}
            unavailable={failedStats.has("salesThisMonth")}
          />
          <StatTile
            icon={outlineIcons.ShoppingBag}
            label={translate("Purchase Orders", "طلبات الشراء")}
            value={data?.purchaseOrdersCount}
            loading={loading}
            unavailable={failedStats.has("purchaseOrdersCount")}
            to={canIReadPurchaseOrders ? `${HOME}/${paths.purchaseOrders}` : undefined}
          />
          <StatTile
            icon={outlineIcons.Building}
            label={translate("Vendors", "البائعون")}
            value={data?.vendorsCount}
            loading={loading}
            unavailable={failedStats.has("vendorsCount")}
            to={canIReadVendors ? `${HOME}/${paths.vendors}` : undefined}
          />
          <StatTile
            icon={outlineIcons.Users}
            label={translate("Customers", "العملاء")}
            value={data?.customersCount}
            loading={loading}
            unavailable={failedStats.has("customersCount")}
            to={`${HOME}/${paths.customers}`}
          />
          <StatTile
            icon={outlineIcons.Squares}
            label={translate("Products", "المنتجات")}
            value={data?.productsCount}
            loading={loading}
            unavailable={failedStats.has("productsCount")}
            to={canIReadProducts ? `${HOME}/${paths.products}` : undefined}
          />
          <StatTile
            icon={outlineIcons.ExclamationCircle}
            label={translate("Low Stock Products (≤5)", "منتجات منخفضة المخزون (≤5)")}
            value={data?.lowStockCount}
            loading={loading}
            unavailable={failedStats.has("lowStockCount")}
            to={canIReadProducts ? `${HOME}/${paths.products}` : undefined}
          />
          <StatTile
            icon={outlineIcons.DollarSign}
            label={translate("Cash & Bank Balance", "رصيد النقدية والبنوك")}
            value={data && formatCurrency(data.cashBalance, language)}
            loading={loading}
            unavailable={failedStats.has("cashBalance")}
            to={canIReadCash ? paths.cash : undefined}
          />
        </div>
        {error && !loading && (
          <p className="mt-2 text-xs text-gray-400">
            {translate("Some statistics could not be loaded.", "تعذر تحميل بعض الإحصائيات.")}
          </p>
        )}
      </AdminLayoutBox>

      {/* Quick Navigation */}
      <AdminLayoutBox header={{ title: translate("Quick Navigation", "التنقل السريع") }}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickNavCards.map((card) => (
            <QuickNavCard key={card.to} to={card.to} Icon={card.Icon} title={card.title} />
          ))}
        </div>
      </AdminLayoutBox>

      {/* Recent Activity */}
      <AdminLayoutBox header={{ title: translate("Recent Activity", "النشاط الأخير") }}>
        {loading ? (
          <p className="text-sm text-gray-400">{translations.loading}</p>
        ) : !data?.recentActivity.length ? (
          <p className="text-sm text-gray-400">{translate("No recent activity", "لا يوجد نشاط حديث")}</p>
        ) : (
          <div className="flex flex-col divide-y">
            {data.recentActivity.map((entry) => (
              <Link
                key={`${entry.kind}-${entry.id}`}
                to={entry.to}
                className="flex items-center justify-between gap-3 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  {entry.kind === "sale" ? (
                    <outlineIcons.ShoppingCart className="text-sky-600" size={18} />
                  ) : (
                    <outlineIcons.ShoppingBag className="text-orange-500" size={18} />
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">
                      {entry.kind === "sale"
                        ? translate("Sales Order", "طلب بيع")
                        : translate("Purchase Order", "طلب شراء")}
                      {entry.code ? ` #${entry.code}` : ""}
                    </span>
                    <span className="text-xs text-gray-500">{entry.partyName}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(entry.amount, language)}</span>
                  <span className="text-xs text-gray-400">{formatDateAndTime(entry.createdAt, language)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </AdminLayoutBox>
    </div>
  );
}
