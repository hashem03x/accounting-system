import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useDataHandler from "@/hooks/useDataHandler";
import useWarehouseHelpers from "@/hooks/useWarehouseHelpers";
import { useWarehouses } from "@/context/WarehousesContext";
import handleRequest from "@/utils/helpers/handle-request";
import { matchesSearchTerm } from "@/utils/helpers/local-search";
import paths from "@/utils/constants/paths";
import { formatDate } from "@/utils/helpers/date-formaters";
import { DateTimePicker } from "@mantine/dates";
import { Button, Select, Table, Text, TextInput } from "@mantine/core";
import AdminLayoutBox from "@/components/ui/admin-layout-box";
import LoadingSection from "@/components/ui/sections/loading";
import ErrorSection from "@/components/ui/sections/error";
import EmptySection from "@/components/ui/sections/empty";
import { solidIcons } from "@/components/icons";
import type { Warehouse } from "@/types/warehouse";
import { expenseCategoriesArray } from "@/utils/constants/expense-categories";

const URL = "reports/expenses";
const FILENAME = "expenses-report.xlsx";

interface Expense {
  _id: string;
  description: string;
  expenseCategory: string;
  createdAt: string;
  updatedAt: string;
  payment: {
    amount: number;
    method: string;
    status: string;
  };
  warehouse: {
    _id: string;
    name: string;
  };
  creator: {
    name: string;
  };
}

interface CategorySummary {
  category: string;
  count: number;
  amount: number;
  percentage: string;
}

interface ReportData {
  expenses: Expense[];
  summary: {
    totalExpenses: number;
    totalAmount: number;
    byCategory: CategorySummary[];
  };
}

export default function ExpensesReport() {
  const { language, translate, translations } = useLanguage();
  const { getWarehouseNameById } = useWarehouseHelpers();
  const { data: warehouses } = useWarehouses();

  const title = translate("Expenses Report", "تقرير المصروفات");

  useDocumentTitle(title);

  const [searchParams, setSearchParams] = useSearchParams();

  const startDateParam = searchParams.get("startDate");
  const endDateParam = searchParams.get("endDate");

  const startDate = startDateParam ? new Date(startDateParam) : null;
  const endDate = endDateParam ? new Date(endDateParam) : null;
  const category = searchParams.get("category") || "";
  const warehouse = searchParams.get("warehouse") || "";

  const updateFilter = (key: string, value: string) => {
    if (!value) searchParams.delete(key);
    else searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const setStartDate = (startDate: string) => updateFilter("startDate", startDate);
  const setEndDate = (endDate: string) => updateFilter("endDate", endDate);
  const setCategory = (category: string) => updateFilter("category", category);
  const setWarehouse = (warehouse: string) => updateFilter("warehouse", warehouse);

  const { privateRequest, loading, setLoading, error, setError, data, setData } = useDataHandler<ReportData>({
    initialData: { expenses: [], summary: { totalExpenses: 0, totalAmount: 0, byCategory: [] } },
    initialLoading: true,
  });

  function handleLoadData() {
    const controller = new AbortController();
    const canceled = { current: false };

    const executeFetch = async () => {
      const response = await privateRequest({
        url: URL,
        params: { ...Object.fromEntries(searchParams) },
        signal: controller.signal,
        language,
      });
      setData(response.data);
    };

    handleRequest(language, setLoading, setError, executeFetch, canceled);

    return () => {
      controller.abort();
      canceled.current = true;
    };
  }

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const cancelRequest = handleLoadData();
    return cancelRequest;
  }, [searchParams]);

  const getExpenseCategoryLabel = (category: string) => {
    switch (category) {
      case "office-supplies":
        return translate("Office Supplies", "لوازم مكتبية");
      case "operating-expenses":
        return translate("Operating Expenses", "مصاريف تشغيلية");
      case "finance-charges":
        return translate("Finance Charges", "رسوم مالية");
      default:
        return category;
    }
  };

  // Local, frontend-only search - filters the already-fetched report rows in the browser, no
  // extra request per keystroke. Searches description, category, payment method/status,
  // warehouse, and creator.
  const [search, setSearch] = useState("");
  const filteredExpenses = useMemo(() => {
    return data.expenses.filter((expense) =>
      matchesSearchTerm(search, [
        expense.description,
        getExpenseCategoryLabel(expense.expenseCategory),
        expense.payment.method,
        expense.payment.status,
        getWarehouseNameById(expense.warehouse._id),
        expense.creator?.name,
      ]),
    );
  }, [data, search]);

  const filteredSummary = useMemo(() => {
    if (!search) return data.summary;

    const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.payment.amount, 0);
    const byCategoryMap = new Map<string, { count: number; amount: number }>();
    filteredExpenses.forEach((expense) => {
      const entry = byCategoryMap.get(expense.expenseCategory) || { count: 0, amount: 0 };
      entry.count += 1;
      entry.amount += expense.payment.amount;
      byCategoryMap.set(expense.expenseCategory, entry);
    });

    return {
      totalExpenses: filteredExpenses.length,
      totalAmount,
      byCategory: Array.from(byCategoryMap.entries()).map(([category, { count, amount }]) => ({
        category,
        count,
        amount,
        percentage: totalAmount ? ((amount / totalAmount) * 100).toFixed(2) : "0.00",
      })),
    };
  }, [data, search, filteredExpenses]);

  const hasActiveFilters = Boolean(search || startDate || endDate || category || warehouse);
  const clearFilters = () => {
    setSearch("");
    setSearchParams(new URLSearchParams());
  };

  return (
    <AdminLayoutBox
      header={{
        backLink: `/${paths.admin}/${paths.reports}`,
        title: title,
        border: true,
        sideElements: (
          <Button
            variant="light"
            color="green"
            radius="md"
            disabled={downloading}
            leftSection={downloading ? <solidIcons.Spinner className="animate-spin" /> : <solidIcons.Download />}
            onClick={async () => {
              setDownloading(true);
              await privateRequest({
                method: "POST",
                url: URL,
                params: { ...Object.fromEntries(searchParams) },
                filename: FILENAME,
                download: true,
              });
              setDownloading(false);
            }}
          >
            {downloading ? translate("Preparing...", "جاري التحضير...") : translate("Download", "تحميل")}
          </Button>
        ),
      }}
    >
      {/* Filters */}
      <div className="flex flex-col gap-4">
        {/* Local search (description, category, payment method/status, warehouse, or creator - filters the already-loaded data client-side) */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <TextInput
            className="flex-1"
            label={translate("Search", "بحث")}
            placeholder={translate("Description, category, payment, warehouse, or creator...", "الوصف، الفئة، الدفع، المستودع، أو المنشئ...")}
            leftSection={<solidIcons.Search />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          {hasActiveFilters && (
            <Button variant="subtle" color="gray" onClick={clearFilters}>
              {translate("Clear Filters", "مسح الفلاتر")}
            </Button>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DateTimePicker
            label={translate("Start Date", "تاريخ البداية")}
            placeholder={translate("Select Start Date", "حدد تاريخ البداية")}
            value={startDate}
            onChange={(date) => setStartDate(date?.toISOString() || "")}
            clearable
          />
          <DateTimePicker
            label={translate("End Date", "تاريخ النهاية")}
            placeholder={translate("Select End Date", "حدد تاريخ النهاية")}
            value={endDate}
            onChange={(date) => setEndDate(date?.toISOString() || "")}
            clearable
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Category */}
          <Select
            clearable
            value={category}
            onChange={(value) => setCategory(value || "")}
            label={translate("Category", "الفئة")}
            placeholder={translate("Select Category", "اختر الفئة")}
            data={expenseCategoriesArray.map((category) => ({
              value: category.value,
              label: translate(category.label.en, category.label.ar),
            }))}
          />

          {/* Warehouse */}
          <Select
            clearable
            value={warehouse}
            onChange={(value) => setWarehouse(value || "")}
            label={translate("Warehouse", "المستودع")}
            placeholder={translate("Select Warehouse", "اختر المستودع")}
            data={warehouses.map((warehouse: Warehouse) => ({
              value: warehouse._id,
              label: warehouse.name,
            }))}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSection message={translate("Generating report", "جاري إنشاء التقرير")} />
      ) : error ? (
        <ErrorSection
          errorTitle={translate("Error Generating Report", "خطأ في إنشاء التقرير")}
          errorMessage={error}
          button={{ text: translate("Try again", "حاول مرة أخرى"), onClick: handleLoadData }}
        />
      ) : data?.expenses?.length === 0 ? (
        <EmptySection useDefaultImg message={translate("No Data Found", "لا توجد بيانات")} />
      ) : filteredExpenses.length === 0 ? (
        <EmptySection useDefaultImg message={translate("No expenses match your search", "لا توجد مصروفات مطابقة لبحثك")} />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded border p-4">
              <Text size="sm" c="dimmed">
                {translate("Total Expenses", "إجمالي المصروفات")}
              </Text>
              <Text size="xl" fw={700}>
                {filteredSummary.totalExpenses}
              </Text>
            </div>
            <div className="rounded border p-4">
              <Text size="sm" c="dimmed">
                {translate("Total Amount", "المبلغ الإجمالي")}
              </Text>
              <Text size="xl" fw={700}>
                ${filteredSummary.totalAmount.toLocaleString()}
              </Text>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="text-nowrap" verticalSpacing="xs" withColumnBorders>
              <Table.Thead className="bg-gray-100 text-gray-800">
                <Table.Tr>
                  <Table.Th>{translate("Date", "التاريخ")}</Table.Th>
                  <Table.Th>{translate("Description", "الوصف")}</Table.Th>
                  <Table.Th>{translate("Category", "الفئة")}</Table.Th>
                  <Table.Th>{translate("Payment Method", "طريقة الدفع")}</Table.Th>
                  <Table.Th>{translate("Payment Status", "حالة الدفع")}</Table.Th>
                  <Table.Th>{translate("Amount", "المبلغ")}</Table.Th>
                  <Table.Th>{translate("Warehouse", "المستودع")}</Table.Th>
                  <Table.Th>{translate("Creator", "المنشئ")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredExpenses.map((expense) => (
                  <Table.Tr key={expense._id}>
                    <Table.Td>{formatDate(expense.createdAt, language)}</Table.Td>
                    <Table.Td>{expense.description}</Table.Td>
                    <Table.Td>{getExpenseCategoryLabel(expense.expenseCategory)}</Table.Td>
                    <Table.Td>{expense.payment.method}</Table.Td>
                    <Table.Td>{expense.payment.status}</Table.Td>
                    <Table.Td>{expense.payment.amount}</Table.Td>
                    <Table.Td>{getWarehouseNameById(expense.warehouse._id)}</Table.Td>
                    <Table.Td>{expense.creator.name}</Table.Td>
                  </Table.Tr>
                ))}

                {/* Total Row */}
                <Table.Tr className="font-semibold text-gray-800" style={{ backgroundColor: "#f3f4f6" }}>
                  <Table.Td colSpan={7} className="text-right">
                    {translate("Total", "المجموع")}
                  </Table.Td>
                  <Table.Td>
                    {filteredExpenses.reduce((acc, expense) => acc + expense.payment.amount, 0).toFixed(2)}{" "}
                    {translations.currency}
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </div>

          <div className="mt-4">
            <Text size="lg" fw={500} mb={2}>
              {translate("Expenses by Category", "المصروفات حسب الفئة")}
            </Text>
            <Table className="text-nowrap" verticalSpacing="xs" withColumnBorders>
              <Table.Thead className="bg-gray-100 text-gray-800">
                <Table.Tr>
                  <Table.Th>{translate("Category", "الفئة")}</Table.Th>
                  <Table.Th>{translate("Count", "العدد")}</Table.Th>
                  <Table.Th>{translate("Amount", "المبلغ")}</Table.Th>
                  <Table.Th>{translate("Percentage", "النسبة المئوية")}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredSummary.byCategory.map((item) => (
                  <Table.Tr key={item.category} className="text-gray-600">
                    <Table.Td className="font-semibold text-gray-800">{getExpenseCategoryLabel(item.category)}</Table.Td>
                    <Table.Td>{item.count}</Table.Td>
                    <Table.Td>
                      {item.amount.toFixed(2)} {translations.currency}
                    </Table.Td>
                    <Table.Td>{item.percentage}%</Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        </div>
      )}
    </AdminLayoutBox>
  );
}
