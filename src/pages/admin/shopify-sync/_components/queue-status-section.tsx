import { useCallback, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { Badge, Button, Loader } from "@mantine/core";
import { outlineIcons, solidIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

type QueueStatus = {
  pending: number;
  processing: number;
  failed: number;
  completed: number;
};

const ACTIONS: SyncAction[] = [
  {
    key: "clear-pending",
    label: ["Clear Pending Jobs", "مسح المهام المعلّقة"],
    warning: [
      "Deletes every job currently waiting to run. Nothing already synced is affected - a future product/inventory/order change will simply queue a fresh job when it happens. Use this to clear out stale jobs left over from before a configuration fix (e.g. old Sale-collection jobs from before the Smart Collection issue was fixed).",
      "سيتم حذف كل مهمة بانتظار التشغيل حاليًا. لن يتأثر أي شيء تمت مزامنته بالفعل - سيؤدي أي تغيير مستقبلي في المنتج/المخزون/الطلب إلى جدولة مهمة جديدة عند حدوثه. استخدم هذا لمسح المهام القديمة المتبقية من قبل إصلاح الإعداد.",
    ],
    url: "shopify/queue/clear-pending",
  },
  {
    key: "clear-failed",
    label: ["Clear Failed Jobs", "مسح المهام الفاشلة"],
    warning: [
      "Permanently deletes every job currently marked failed, including their error history. Use this after confirming the underlying issue is fixed and you don't need to inspect these failures anymore - prefer 'Retry Failed Jobs' if you want them to run again instead.",
      "سيتم حذف كل مهمة مسجلة حاليًا كفاشلة نهائيًا، بما في ذلك سجل الأخطاء الخاص بها. استخدم هذا بعد التأكد من إصلاح المشكلة الأساسية ولم تعد بحاجة لفحص هذه الإخفاقات - يفضل استخدام 'إعادة محاولة المهام الفاشلة' إذا كنت تريد تشغيلها مرة أخرى بدلاً من ذلك.",
    ],
    url: "shopify/queue/clear-failed",
  },
  {
    key: "cancel-running",
    label: ["Cancel Running Jobs", "إلغاء المهام قيد التشغيل"],
    warning: [
      "Forces every job currently marked 'processing' back to failed, freeing it up to be retried. Only useful for jobs stuck far longer than a normal sync takes (e.g. after a crash) - a job that's still genuinely running may finish and overwrite this.",
      "سيتم إجبار كل مهمة مسجلة حاليًا كـ 'قيد المعالجة' على العودة إلى فاشلة، مما يتيح إعادة محاولتها. مفيد فقط للمهام العالقة لفترة أطول بكثير من المزامنة العادية (مثلاً بعد تعطل) - المهمة التي لا تزال قيد التشغيل فعليًا قد تكتمل وتتجاوز هذا الإجراء.",
    ],
    url: "shopify/queue/cancel-running",
  },
];

/**
 * "View queue status" (explicit admin dashboard requirement) - shows how many background sync
 * jobs are waiting, currently running, failed, or recently completed, plus explicit manual queue
 * management actions (Clear Pending/Clear Failed/Cancel Running - never automatic, per the
 * "Manual Queue Management" requirement). Polls on an interval (unlike most other sections here,
 * which only refetch when `refreshKey` changes) because queue depth moves on its own as the
 * background worker processes jobs, not just in response to something the admin clicked here.
 */
export default function QueueStatusSection({ refreshKey, onActionTriggered }: { refreshKey: number; onActionTriggered: () => void }) {
  const { translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [status, setStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SyncAction | null>(null);
  const [opened, { open, close }] = useDisclosure();

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

  function choose(action: SyncAction) {
    setSelected(action);
    open();
  }

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

      <div className="flex flex-wrap gap-2 pt-1">
        <Button size="xs" variant="light" color="gray" leftSection={<outlineIcons.ExclamationCircle size={16} />} onClick={() => choose(ACTIONS[0]!)}>
          {translate(...ACTIONS[0]!.label)}
        </Button>
        <Button size="xs" variant="light" color="red" leftSection={<outlineIcons.ExclamationCircle size={16} />} onClick={() => choose(ACTIONS[1]!)}>
          {translate(...ACTIONS[1]!.label)}
        </Button>
        <Button size="xs" variant="light" color="orange" leftSection={<solidIcons.ExclamationCircle size={16} />} onClick={() => choose(ACTIONS[2]!)}>
          {translate(...ACTIONS[2]!.label)}
        </Button>
      </div>

      <ConfirmActionModal
        action={selected}
        opened={opened}
        onClose={close}
        onDone={() => {
          onActionTriggered();
          fetchStatus();
        }}
      />
    </div>
  );
}
