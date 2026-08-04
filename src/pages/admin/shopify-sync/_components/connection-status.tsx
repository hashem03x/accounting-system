import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { Badge, Loader, Tooltip } from "@mantine/core";
import { solidIcons } from "@/components/icons";

type ConnectionStatusData = {
  connected: boolean;
  shopify: { connected: boolean; error: string | null };
  accounting: { connected: boolean };
  lastProductSync: { time: string; status: string; error?: string } | null;
  lastInventorySync: { time: string; status: string; error?: string } | null;
  lastWebhookEvent: { time: string; status: string; action: string } | null;
  lastError: { time: string; action: string; error?: string } | null;
};

function formatTime(iso: string | undefined, language: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(language);
}

export default function ConnectionStatus({ refreshKey }: { refreshKey: number }) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [data, setData] = useState<ConnectionStatusData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await privateRequest({ url: "shopify/status", language });
      setData(response.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{translate("Connection Status", "حالة الاتصال")}</h3>
        {loading && <Loader size="xs" />}
      </div>

      {data && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {data.connected ? (
              <Badge color="teal" leftSection={<solidIcons.CheckCircle size={12} />}>
                {translate("Connected", "متصل")}
              </Badge>
            ) : (
              <Tooltip label={data.shopify.error || ""} disabled={!data.shopify.error}>
                <Badge color="red" leftSection={<solidIcons.ExclamationCircle size={12} />}>
                  {translate("Disconnected", "غير متصل")}
                </Badge>
              </Tooltip>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Last Successful Sync", "آخر مزامنة ناجحة")}</span>
              <span className="text-sm font-medium">
                {formatTime(data.lastProductSync?.status === "success" ? data.lastProductSync.time : undefined, language)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Last Inventory Sync", "آخر مزامنة مخزون")}</span>
              <span className="text-sm font-medium">{formatTime(data.lastInventorySync?.time, language)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Last Product Sync", "آخر مزامنة منتج")}</span>
              <span className="text-sm font-medium">{formatTime(data.lastProductSync?.time, language)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Last Webhook Event", "آخر حدث ويب هوك")}</span>
              <span className="text-sm font-medium">{formatTime(data.lastWebhookEvent?.time, language)}</span>
            </div>
          </div>

          {data.lastError && (
            <div className="flex flex-col gap-1 rounded-lg bg-red-50 p-3 text-red-700">
              <span className="text-xs font-medium">
                {translate("Last Error", "آخر خطأ")} · {formatTime(data.lastError.time, language)}
              </span>
              <span className="break-words text-xs">{data.lastError.error}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
