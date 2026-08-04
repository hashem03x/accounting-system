import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { Badge, Loader } from "@mantine/core";

type QueueStatus = {
  pending: number;
  processing: number;
  failed: number;
  completed: number;
};

/**
 * "View queue status" (explicit admin dashboard requirement) - shows how many background sync
 * jobs are waiting, currently running, failed, or recently completed on the integration service.
 * Polls on an interval (unlike the other sections here, which only refetch when `refreshKey`
 * changes) because queue depth moves on its own as the background worker processes jobs, not just
 * in response to something the admin clicked on this page.
 */
export default function QueueStatusSection({ refreshKey }: { refreshKey: number }) {
  const { translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await privateRequest({ url: "shopify/queue-status" });
      setStatus(response.data);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{translate("Queue Status", "حالة قائمة الانتظار")}</h3>
        {loading && <Loader size="xs" />}
      </div>

      {status && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{translate("Pending", "بالانتظار")}</span>
            <Badge color={status.pending > 0 ? "yellow" : "gray"} size="lg">
              {status.pending}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{translate("Processing", "قيد المعالجة")}</span>
            <Badge color={status.processing > 0 ? "blue" : "gray"} size="lg">
              {status.processing}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{translate("Failed", "فشل")}</span>
            <Badge color={status.failed > 0 ? "red" : "gray"} size="lg">
              {status.failed}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{translate("Completed (recent)", "مكتمل (مؤخرًا)")}</span>
            <Badge color="teal" size="lg">
              {status.completed}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
