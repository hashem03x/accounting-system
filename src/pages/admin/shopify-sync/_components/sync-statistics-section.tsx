import { useCallback, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { Badge, Button, Loader, Progress } from "@mantine/core";
import { outlineIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

type SyncStatistics = {
  totalProducts: number;
  syncedProducts: number;
  unsyncedProducts: number;
  syncPercentage: number;
};

const SYNC_UNSYNCED_ACTION: SyncAction = {
  key: "sync-unsynced",
  label: ["Sync Unsynced Products", "مزامنة المنتجات غير المتزامنة"],
  warning: [
    "Queues every product that has never been successfully synced to Shopify - already-synced products are skipped entirely, so this never recreates or duplicates anything. Safe to run at any time, including while a previous run is still finishing.",
    "سيتم جدولة كل منتج لم تتم مزامنته بنجاح مع Shopify من قبل - سيتم تخطي المنتجات المتزامنة بالفعل تمامًا، لذا لن يؤدي هذا أبدًا إلى إعادة إنشاء أو تكرار أي شيء. آمن للتشغيل في أي وقت، حتى أثناء انتهاء تشغيل سابق.",
  ],
  url: "shopify/sync/unsynced-products",
};

function progressColor(percentage: number): string {
  if (percentage >= 100) return "teal";
  if (percentage >= 50) return "blue";
  return "orange";
}

/**
 * "Synchronization Status" card - total/synced/unsynced product counts and a progress bar,
 * backed by `GET shopify/statistics` (a fast DB-count-only endpoint - see mapping.service.js#
 * getSyncStatistics, never calls Shopify). Polls like QueueStatusSection/StoreInitSection do,
 * since "Sync Unsynced Products" below runs in the background via the queue - a single refetch
 * right after clicking wouldn't reflect jobs that finish moments later.
 */
export default function SyncStatisticsSection({ refreshKey, onActionTriggered }: { refreshKey: number; onActionTriggered: () => void }) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [stats, setStats] = useState<SyncStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [opened, { open, close }] = useDisclosure();

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    try {
      const response = await privateRequest({ url: "shopify/statistics", language });
      setStats(response.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    fetchStatistics();
    const interval = setInterval(fetchStatistics, 10000);
    return () => clearInterval(interval);
  }, [fetchStatistics]);

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{translate("Synchronization Status", "حالة المزامنة")}</h3>
        {loading && <Loader size="xs" />}
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Total Products", "إجمالي المنتجات")}</span>
              <span className="text-sm font-medium">{stats.totalProducts.toLocaleString(language)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Synced Products", "المنتجات المتزامنة")}</span>
              <Badge color="teal" size="lg">
                {stats.syncedProducts.toLocaleString(language)}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Unsynced Products", "المنتجات غير المتزامنة")}</span>
              <Badge color={stats.unsyncedProducts > 0 ? "orange" : "gray"} size="lg">
                {stats.unsyncedProducts.toLocaleString(language)}
              </Badge>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{translate("Sync Progress", "تقدم المزامنة")}</span>
              <span className="text-sm font-medium">{stats.syncPercentage}%</span>
            </div>
            <Progress value={stats.syncPercentage} color={progressColor(stats.syncPercentage)} size="lg" radius="xl" />
          </div>
        </>
      )}

      {!stats && !loading && <p className="text-sm text-gray-500">{translate("Sync statistics are unavailable right now.", "إحصائيات المزامنة غير متاحة حاليًا.")}</p>}

      <div className="pt-1">
        <Button
          size="xs"
          variant="light"
          color="grape"
          leftSection={<outlineIcons.ArrowUpOnSquare size={16} />}
          disabled={loading || !stats || stats.unsyncedProducts === 0}
          onClick={open}
        >
          {translate(...SYNC_UNSYNCED_ACTION.label)}
        </Button>
      </div>

      <ConfirmActionModal
        action={SYNC_UNSYNCED_ACTION}
        opened={opened}
        onClose={close}
        onDone={() => {
          onActionTriggered();
          fetchStatistics();
        }}
      />
    </div>
  );
}
