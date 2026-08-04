import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { notifyError, notifySuccess } from "@/utils/helpers/notifiers";
import { Alert, Button } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import Modal from "@/components/ui/modal";

export type SyncAction = {
  key: string;
  label: [string, string];
  warning: [string, string];
  url: string;
  method?: "post" | "get";
  body?: Record<string, unknown>;
};

/**
 * Shared confirm-dialog + loading-state + success/error-toast pattern for every Shopify sync
 * action button on this page (Part 7 "Admin UX Improvements": confirmation dialog, progress
 * indicator, disabled duplicate clicks, success/error toast, refresh after). One component
 * instead of copy-pasting this five times across product/inventory/mapping sections.
 */
export default function ConfirmActionModal({
  action,
  opened,
  onClose,
  onDone,
}: {
  action: SyncAction | null;
  opened: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [loading, setLoading] = useState(false);

  async function confirm() {
    if (!action) return;
    setLoading(true);
    try {
      await privateRequest({ url: action.url, method: (action.method ?? "post").toUpperCase(), data: action.body, language });
      notifySuccess({
        language,
        title: translate("Started", "بدأت"),
        message: translate("The action was queued and is running in the background.", "تمت جدولة الإجراء وهو قيد التشغيل في الخلفية."),
      });
      onClose();
      onDone();
    } catch (err) {
      notifyError({
        language,
        title: translate("Could not start", "تعذر البدء"),
        message: err instanceof Error ? err.message : translate("Something went wrong", "حدث خطأ ما"),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title={action ? translate(...action.label) : ""}>
      {action && (
        <div className="flex flex-col gap-3">
          <Alert color="orange" icon={<solidIcons.ExclamationCircle />}>
            {translate(...action.warning)}
          </Alert>
          <div className="flex items-center gap-2">
            <Button size="sm" loading={loading} disabled={loading} onClick={confirm}>
              {translate("Confirm", "تأكيد")}
            </Button>
            <Button variant="light" color="dark" size="sm" onClick={onClose} disabled={loading}>
              {translate("Cancel", "إلغاء")}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
