import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { useDisclosure } from "@mantine/hooks";
import { Badge, Button, Loader, Switch } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

type StatusResponse = {
  connected: boolean;
  shopify: { connected: boolean; error: string | null };
  accounting: { connected: boolean };
  lastProductSync: { time: string; status: string; error?: string } | null;
};

type StatsResponse = {
  totalAccountingProducts: number;
  mappedProducts: number;
  unmappedProducts: number;
};

type QueueStatusResponse = { failed: number };

function formatTime(iso: string | undefined, language: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(language);
}

const SYNC_EVERYTHING_ACTION: SyncAction = {
  key: "sync-everything",
  label: ["Sync Everything Now", "مزامنة كل شيء الآن"],
  warning: [
    "Queues every product to be re-checked against Shopify. Only products that actually changed are re-sent - safe to run at any time.",
    "سيتم جدولة إعادة فحص جميع المنتجات مقابل Shopify. سيتم إعادة إرسال المنتجات التي تغيرت فعليًا فقط - آمن للتشغيل في أي وقت.",
  ],
  url: "shopify/sync/products",
};

/**
 * The default, non-technical view of this page ("Part 8 - business-friendly dashboard"): a single
 * card answering "is Shopify working" without logs/JSON/IDs. The detailed sections (queue, logs,
 * mapping internals, per-action dry-run/force buttons) stay available - just moved behind the
 * "Developer Mode" switch in the page header - rather than deleted, since they're genuinely useful
 * for diagnosing the "N items need attention" count this card surfaces.
 */
export default function IntegrationSummary({
  refreshKey,
  onActionTriggered,
  devMode,
  onDevModeChange,
}: {
  refreshKey: number;
  onActionTriggered: () => void;
  devMode: boolean;
  onDevModeChange: (value: boolean) => void;
}) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [failedJobs, setFailedJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);
  const [syncOpened, { open: openSync, close: closeSync }] = useDisclosure(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statusRes, statsRes, queueRes] = await Promise.all([
        privateRequest({ url: "shopify/status", language }),
        privateRequest({ url: "shopify/stats", language }),
        privateRequest({ url: "shopify/queue-status", language }),
      ]);
      setStatus(statusRes.data);
      setStats(statsRes.data);
      setFailedJobs((queueRes.data as QueueStatusResponse).failed ?? 0);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  async function reconnect() {
    setReconnecting(true);
    try {
      await fetchAll();
    } finally {
      setReconnecting(false);
    }
  }

  const attentionCount = (stats?.unmappedProducts ?? 0) + failedJobs;

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{translate("Shopify Integration", "تكامل Shopify")}</h3>
        <div className="flex items-center gap-3">
          {loading && <Loader size="xs" />}
          <Switch
            size="sm"
            label={translate("Developer Mode", "وضع المطور")}
            checked={devMode}
            onChange={e => onDevModeChange(e.currentTarget.checked)}
          />
        </div>
      </div>

      {status && (
        <div className="flex flex-col gap-3">
          <div>
            {status.connected ? (
              <Badge size="lg" color="teal" leftSection={<solidIcons.CheckCircle size={14} />}>
                {translate("Connected", "متصل")}
              </Badge>
            ) : (
              <Badge size="lg" color="red" leftSection={<solidIcons.ExclamationCircle size={14} />}>
                {translate("Disconnected", "غير متصل")}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Products", "المنتجات")}</span>
              <span className="text-sm font-medium">
                {translate(
                  `${stats?.mappedProducts ?? 0} of ${stats?.totalAccountingProducts ?? 0} products synchronized`,
                  `تمت مزامنة ${stats?.mappedProducts ?? 0} من ${stats?.totalAccountingProducts ?? 0} منتج`,
                )}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Last Update", "آخر تحديث")}</span>
              <span className="text-sm font-medium">{formatTime(status.lastProductSync?.time, language)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Needs Attention", "يتطلب الانتباه")}</span>
              <span className="text-sm font-medium">
                {attentionCount > 0
                  ? translate(`${attentionCount} item(s) need attention`, `${attentionCount} عنصر يتطلب الانتباه`)
                  : translate("Nothing - all good", "لا شيء - كل شيء على ما يرام")}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button size="sm" onClick={openSync}>
              {translate("Sync Everything Now", "مزامنة كل شيء الآن")}
            </Button>
            <Button size="sm" variant="light" color="gray" loading={reconnecting} onClick={reconnect}>
              {translate("Reconnect Shopify", "إعادة الاتصال بـ Shopify")}
            </Button>
          </div>
        </div>
      )}

      {!status && !loading && (
        <p className="text-sm text-gray-500">{translate("Shopify status is unavailable right now.", "حالة Shopify غير متاحة حاليًا.")}</p>
      )}

      <ConfirmActionModal action={SYNC_EVERYTHING_ACTION} opened={syncOpened} onClose={closeSync} onDone={onActionTriggered} />
    </div>
  );
}
