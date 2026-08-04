import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { Badge, Button, Loader, Select, Table, Tooltip } from "@mantine/core";
import { solidIcons } from "@/components/icons";

type LogEntry = {
  id: string;
  time: string;
  entityType: "product" | "inventory";
  accountingId: string;
  action: string;
  status: "success" | "failed" | "skipped";
  error?: string;
  durationMs?: number;
};

function StatusBadge({ status }: { status: LogEntry["status"] }) {
  const { translate } = useLanguage();
  if (status === "success") return <Badge color="teal">{translate("Success", "نجاح")}</Badge>;
  if (status === "failed") return <Badge color="red">{translate("Failed", "فشل")}</Badge>;
  return <Badge color="gray">{translate("Skipped", "تم التخطي")}</Badge>;
}

export default function LogsSection({ refreshKey }: { refreshKey: number }) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [entityTypeFilter, setEntityTypeFilter] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await privateRequest({
        url: "shopify/logs",
        params: {
          ...(statusFilter ? { status: statusFilter } : {}),
          ...(entityTypeFilter ? { entityType: entityTypeFilter } : {}),
          limit: 100,
        },
        language,
      });
      setLogs(response.data || []);
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, statusFilter, entityTypeFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const successCount = logs.filter(l => l.status === "success").length;
  const failedCount = logs.filter(l => l.status === "failed").length;
  const skippedCount = logs.filter(l => l.status === "skipped").length;

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{translate("Sync Logs", "سجلات المزامنة")}</h3>
        <div className="flex items-center gap-2">
          {loading && <Loader size="xs" />}
          <Tooltip label={translate("Refresh", "تحديث")}>
            <Button variant="subtle" color="dark" size="xs" px="xs" onClick={fetchLogs} disabled={loading}>
              <solidIcons.ArrowPath size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge color="teal" variant="light">
          {translate("Success", "نجاح")}: {successCount}
        </Badge>
        <Badge color="red" variant="light">
          {translate("Failed", "فشل")}: {failedCount}
        </Badge>
        <Badge color="gray" variant="light">
          {translate("Skipped", "تم التخطي")}: {skippedCount}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        <Select
          size="xs"
          placeholder={translate("All statuses", "كل الحالات")}
          clearable
          value={statusFilter}
          onChange={setStatusFilter}
          data={[
            { value: "success", label: translate("Success", "نجاح") },
            { value: "failed", label: translate("Failed", "فشل") },
            { value: "skipped", label: translate("Skipped", "تم التخطي") },
          ]}
        />
        <Select
          size="xs"
          placeholder={translate("All types", "كل الأنواع")}
          clearable
          value={entityTypeFilter}
          onChange={setEntityTypeFilter}
          data={[
            { value: "product", label: translate("Product", "منتج") },
            { value: "inventory", label: translate("Inventory", "مخزون") },
          ]}
        />
      </div>

      <div className="overflow-x-auto">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{translate("Time", "الوقت")}</Table.Th>
              <Table.Th>{translate("Product/Variant", "المنتج/المتغير")}</Table.Th>
              <Table.Th>{translate("Operation", "العملية")}</Table.Th>
              <Table.Th>{translate("Status", "الحالة")}</Table.Th>
              <Table.Th>{translate("Error", "الخطأ")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {logs.map(log => (
              <Table.Tr key={log.id}>
                <Table.Td className="whitespace-nowrap text-xs">{new Date(log.time).toLocaleString(language)}</Table.Td>
                <Table.Td className="text-xs">
                  {log.entityType === "product" ? translate("Product", "منتج") : translate("Variant", "متغير")} #{log.accountingId}
                </Table.Td>
                <Table.Td className="text-xs">{log.action}</Table.Td>
                <Table.Td>
                  <StatusBadge status={log.status} />
                </Table.Td>
                <Table.Td className="max-w-[300px] truncate text-xs text-red-600" title={log.error}>
                  {log.error || "—"}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {!loading && logs.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">{translate("No sync activity yet.", "لا يوجد نشاط مزامنة بعد.")}</p>
        )}
      </div>
    </div>
  );
}
