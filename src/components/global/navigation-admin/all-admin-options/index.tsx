import { IconType } from "react-icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { outlineIcons } from "@/components/icons";
import paths from "@/utils/constants/paths";
import resources from "@/utils/constants/resources";
import actions from "@/utils/constants/actions";
import useHasPermission from "@/hooks/useHasPermission";
import AdminButton from "./components/admin-button";
import AdminNavLink from "./components/admin-nav-link";
import AdminNavGroup from "./components/admin-nav-group";

export type NavLinkItem = { to: string; label: string };
export type Link = { to: string; label: string; Icon?: IconType; nestedLinks?: Link[] };
type NavGroup = { id: string; label: string; Icon: IconType; links: NavLinkItem[] };

const STORAGE_KEY = "admin-sidebar-open-groups";

function loadPersistedOpenGroups(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function AllAdminOptions({ closeDrawer }: { closeDrawer?: () => void }) {
  const { translate, translations, toggleLanguage } = useLanguage();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  // One check per resource a sidebar entry is actually gated by at the route level (see
  // App.tsx's ResourceGuard wrappers) - sales orders/customers/expenses have no ResourceGuard at
  // all (explicitly unprotected, per the comments in App.tsx), so those links always show
  // regardless of permission, matching what the route itself actually allows.
  const canIReadVendors = useHasPermission(resources.vendors, actions.read);
  const canIReadPurchaseOrders = useHasPermission(resources.purchaseOrders, actions.read);
  const canIReadProducts = useHasPermission(resources.products, actions.read);
  const canIReadWarehouses = useHasPermission(resources.warehouses, actions.read);
  const canIReadTransfers = useHasPermission(resources.transfers, actions.read);
  const canIReadCategories = useHasPermission(resources.categories, actions.read);
  const canIReadCoupons = useHasPermission(resources.coupons, actions.read);
  const canIReadGovernorates = useHasPermission(resources.governorates, actions.read);
  const canIReadCash = useHasPermission(resources.cash, actions.read);
  const canIReadCurrencies = useHasPermission(resources.currencies, actions.read);
  const canIReadTransactions = useHasPermission(resources.transactions, actions.read);
  const canIReadReports = useHasPermission(resources.reports, actions.read);
  const canIReadAnalytics = useHasPermission(resources.analytics, actions.read);
  const canIReadUsers = useHasPermission(resources.users, actions.read);
  const canIReadFixedAssets = useHasPermission(resources.fixedAssets, actions.read);
  const canIReadCustomization = useHasPermission(resources.customization, actions.read);
  const canIReadShopify = useHasPermission(resources.shopify, actions.read);

  const dashboardLink: Link = {
    to: `${paths.admin}/${paths.home}`,
    label: translations.pages.home,
    Icon: outlineIcons.Home,
  };

  // Every existing sidebar destination, regrouped (see navigation-admin redesign) - nothing here
  // is a new page/route, only how the SAME links are organized. A group with zero visible links
  // (every link inside filtered out by permission) is dropped entirely below, so an empty
  // collapsible section never renders.
  const groups: NavGroup[] = [
    {
      id: "sales",
      label: translate("Sales Management", "إدارة المبيعات"),
      Icon: outlineIcons.ShoppingCart,
      links: [
        { to: `${paths.admin}/${paths.home}/${paths.salesOrders}`, label: translations.pages.salesOrders },
        { to: `${paths.admin}/${paths.home}/${paths.customers}`, label: translations.pages.customers },
        ...(canIReadCoupons ? [{ to: `${paths.admin}/${paths.coupons}`, label: translations.pages.coupons }] : []),
        ...(canIReadGovernorates ? [{ to: `${paths.admin}/${paths.governorates}`, label: translations.pages.governorates }] : []),
      ],
    },
    {
      id: "procurement",
      label: translate("Procurement & Vendors", "المشتريات والموردون"),
      Icon: outlineIcons.ShoppingBag,
      links: [
        ...(canIReadPurchaseOrders ? [{ to: `${paths.admin}/${paths.home}/${paths.purchaseOrders}`, label: translations.pages.purchaseOrders }] : []),
        ...(canIReadVendors ? [{ to: `${paths.admin}/${paths.home}/${paths.vendors}`, label: translations.pages.vendors }] : []),
      ],
    },
    {
      id: "inventory",
      label: translate("Inventory & Products", "المخزون والمنتجات"),
      Icon: outlineIcons.Squares,
      links: [
        ...(canIReadProducts ? [{ to: `${paths.admin}/${paths.home}/${paths.products}`, label: translations.pages.products }] : []),
        ...(canIReadWarehouses ? [{ to: `${paths.admin}/${paths.home}/${paths.warehouses}`, label: translations.pages.warehouses }] : []),
        ...(canIReadTransfers ? [{ to: `${paths.admin}/${paths.home}/${paths.transfers}`, label: translations.pages.transfers }] : []),
        ...(canIReadCategories ? [{ to: `${paths.admin}/${paths.categories}`, label: translations.pages.categories }] : []),
        ...(canIReadFixedAssets ? [{ to: `${paths.admin}/${paths.fixedAssets}`, label: translations.pages.fixedAssets }] : []),
      ],
    },
    {
      id: "accounting",
      label: translate("Accounting & Finance", "المحاسبة والمالية"),
      Icon: outlineIcons.DollarSign,
      links: [
        ...(canIReadCash ? [{ to: `${paths.admin}/${paths.cash}`, label: translations.pages.cash }] : []),
        ...(canIReadCurrencies ? [{ to: `${paths.admin}/${paths.currencies}`, label: translations.pages.currencies }] : []),
        ...(canIReadTransactions ? [{ to: `${paths.admin}/${paths.transactions}`, label: translations.pages.transactions }] : []),
        { to: `${paths.admin}/${paths.home}/${paths.expenses}`, label: translations.pages.expenses },
      ],
    },
    {
      id: "reports-analytics",
      label: translate("Reports & Analytics", "التقارير والتحليلات"),
      Icon: outlineIcons.ChartBar,
      links: [
        ...(canIReadReports ? [{ to: `${paths.admin}/${paths.reports}`, label: translations.pages.reports }] : []),
        ...(canIReadAnalytics ? [{ to: `${paths.admin}/${paths.analytics}`, label: translations.pages.analytics }] : []),
      ],
    },
    {
      id: "system",
      label: translate("System Administration", "إدارة النظام"),
      Icon: outlineIcons.Computer,
      links: [
        ...(canIReadUsers ? [{ to: `${paths.admin}/${paths.users}`, label: translations.pages.users }] : []),
        ...(canIReadCustomization ? [{ to: `${paths.admin}/${paths.customization}`, label: translations.pages.customization }] : []),
        ...(canIReadShopify ? [{ to: `${paths.admin}/${paths.shopifySync}`, label: translations.pages.shopifySync }] : []),
      ],
    },
  ].filter((group) => group.links.length > 0);

  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(loadPersistedOpenGroups()));

  // Auto-expand whichever group contains the active route - additive (never collapses a group the
  // user already opened, or closes the one they're leaving), per the "automatically expand the
  // active group" requirement.
  useEffect(() => {
    const activeGroup = groups.find((group) => group.links.some((link) => pathname.includes(link.to)));
    if (activeGroup) {
      setOpenGroups((prev) => (prev.has(activeGroup.id) ? prev : new Set(prev).add(activeGroup.id)));
    }
    // Only the route should re-trigger this - `groups` is rebuilt every render (permission-
    // derived), so it's intentionally excluded to avoid re-running on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(openGroups)));
  }, [openGroups]);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <nav className="flex flex-1 flex-col overflow-y-auto py-2">
        <AdminNavLink link={dashboardLink} onClick={closeDrawer} />

        {groups.map((group) => (
          <AdminNavGroup
            key={group.id}
            label={group.label}
            Icon={group.Icon}
            links={group.links}
            open={openGroups.has(group.id)}
            onToggle={() => toggleGroup(group.id)}
            onLinkClick={closeDrawer}
          />
        ))}
      </nav>

      <footer className="flex flex-col gap-1 py-2">
        <AdminButton Icon={outlineIcons.Globe} label={translate("عربي", "English")} onClick={toggleLanguage} />
        <hr />
        <AdminButton
          Icon={outlineIcons.ArrowUpCircle}
          label={translations.back}
          onClick={() => {
            closeDrawer && closeDrawer();
            navigate("/");
          }}
        />
      </footer>
    </div>
  );
}
