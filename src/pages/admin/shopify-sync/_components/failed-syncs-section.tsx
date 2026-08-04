import { useCallback, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { Badge, Button, Loader, Table, Tooltip } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

type FailedSync = {
  id: string;
  type: string;
  accountingId?: string;
  attempts: number;
  lastError: string;
  updatedAt: string;
};

const RETRY_ALL_ACTION: SyncAction = {
  key: "retry-failed",
  label: ["Retry Failed Jobs", "إعادة محاولة المهام الفاشلة"],
  warning: [
    "This re-attempts every product and inventory sync currently recorded as failed.",
    "ستتم إعادة محاولة كل مزامنة منتج ومخزون مسجلة حاليًا على أنها فاشلة.",
  ],
  url: "shopify/retry-failed",
};

/**
 * "View Failed Synchronizations" (explicit admin dashboard requirement) - distinct from the
 * general, filterable Sync Logs table: this shows only jobs the queue gave up on after exhausting
 * their retry budget, with the exact error and attempt count, plus a single "Retry Failed Jobs"
 * action (reusing the shared confirm modal) rather than a per-row retry, since the backend only
 * exposes a bulk retry-all endpoint today.
 */
export default function FailedSyncsSection({ refreshKey, onActionTriggered }: { refreshKey: number; onActionTriggered: () => void }) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [items, setItems] = useState<FailedSync[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure();

  const fetchFailed = useCallback(async () => {
    setLoading(true);
    try {
      const response = await privateRequest({ url: "shopify/failed-syncs" });
      setItems(response.data || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    fetchFailed();
  }, [fetchFailed]);

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>
          {translate("Failed Synchronizations", "المزامنات الفاشلة")}{" "}
          {items.length > 0 && (
            <Badge color="red" ml={4}>
              {items.length}
            </Badge>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {loading && <Loader size="xs" />}
          <Tooltip label={translate("Refresh", "تحديث")}>
            <Button variant="subtle" color="dark" size="xs" px="xs" onClick={fetchFailed} disabled={loading}>
              <solidIcons.ArrowPath size={16} />
            </Button>
          </Tooltip>
          <Button size="xs" variant="light" color="red" disabled={items.length === 0} onClick={open}>
            {translate("Retry Failed Jobs", "إعادة محاولة المهام الفاشلة")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{translate("Type", "النوع")}</Table.Th>
              <Table.Th>{translate("Accounting ID", "معرف المحاسبة")}</Table.Th>
              <Table.Th>{translate("Attempts", "المحاولات")}</Table.Th>
              <Table.Th>{translate("Last Error", "آخر خطأ")}</Table.Th>
              <Table.Th>{translate("Last Attempt", "آخر محاولة")}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map(item => (
              <Table.Tr key={item.id}>
                <Table.Td className="text-xs">{item.type}</Table.Td>
                <Table.Td className="text-xs">{item.accountingId || "—"}</Table.Td>
                <Table.Td className="text-xs">{item.attempts}</Table.Td>
                <Table.Td className="max-w-[350px] truncate text-xs text-red-600" title={item.lastError}>
                  {item.lastError || "—"}
                </Table.Td>
                <Table.Td className="whitespace-nowrap text-xs">{new Date(item.updatedAt).toLocaleString(language)}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        {!loading && items.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-500">{translate("No failed synchronizations.", "لا توجد مزامنات فاشلة.")}</p>
        )}
      </div>

      <ConfirmActionModal
        action={RETRY_ALL_ACTION}
        opened={opened}
        onClose={close}
        onDone={() => {
          onActionTriggered();
          fetchFailed();
        }}
      />
    </div>
  );
}
