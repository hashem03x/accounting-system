import { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { notifyError, notifySuccess } from "@/utils/helpers/notifiers";
import { Alert, Badge, Button, Loader, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { outlineIcons, solidIcons } from "@/components/icons";
import Modal from "@/components/ui/modal";
import { useProduct } from "../../context";

type SyncStatusValue = "never" | "success" | "failed";

type VariantSyncStatus = {
  accountingVariantId: string;
  shopifyVariantId: number;
  shopifyInventoryItemId: number;
  updatedAt: string;
  inventoryStatus: { status: SyncStatusValue; attemptedAt: string; error?: string } | null;
};

type ShopifySyncStatus = {
  accountingProductId: string;
  shopifyProductId: number | null;
  lastSyncStatus: SyncStatusValue;
  lastSyncedAt: string | null;
  lastSyncAttemptAt: string | null;
  lastSyncError: string | null;
  variants: VariantSyncStatus[];
};

function StatusBadge({ status }: { status: SyncStatusValue }) {
  const { translate } = useLanguage();
  if (status === "success") return <Badge color="teal">{translate("Synced", "تمت المزامنة")}</Badge>;
  if (status === "failed") return <Badge color="red">{translate("Failed", "فشلت")}</Badge>;
  return <Badge color="gray">{translate("Never synced", "لم تتم المزامنة بعد")}</Badge>;
}

export default function ShopifySyncInformation() {
  const { language, translate } = useLanguage();
  const { currentProduct } = useProduct();
  const privateRequest = usePrivateRequest();

  const [status, setStatus] = useState<ShopifySyncStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<"sync" | "inventory" | "force" | null>(null);
  const [forceModalOpened, { open: openForceModal, close: closeForceModal }] = useDisclosure();

  const fetchStatus = useCallback(async () => {
    if (!currentProduct) return;
    setStatusLoading(true);
    try {
      const response = await privateRequest({ url: `shopify/products/${currentProduct._id}/status`, language });
      setStatus(response.data);
    } catch {
      // Sync status is supplementary, not required for the page to function - fail silently and
      // let the admin retry via the Refresh button.
    } finally {
      setStatusLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct?._id]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  if (!currentProduct) return null;

  async function runAction(action: "sync" | "inventory" | "force", path: string) {
    setActionLoading(action);
    try {
      const response = await privateRequest({ url: `shopify/products/${currentProduct!._id}/${path}`, method: "POST", language });
      // The backend returns HTTP 200 for several non-success outcomes (ambiguous match, mapping
      // conflict, locked, nothing to do) - a 200 response alone does NOT mean the sync succeeded,
      // so branch on the actual outcome status instead of assuming a thrown error is the only
      // failure mode. See ProductSyncOutcome in integration-service/src/sync/product-sync.ts.
      const outcomeStatus: string | undefined = response.data?.status;
      if (outcomeStatus === "ambiguous") {
        notifyError({
          language,
          title: translate("Needs manual review", "يتطلب مراجعة يدوية"),
          message: translate(
            "Multiple possible Shopify matches were found - nothing was changed. Check the sync logs.",
            "تم العثور على عدة تطابقات محتملة في Shopify - لم يتم تغيير أي شيء. راجع سجلات المزامنة.",
          ),
        });
      } else if (outcomeStatus === "conflict") {
        notifyError({
          language,
          title: translate("Mapping conflict", "تعارض في الربط"),
          message: translate(
            "The matching Shopify product is already linked to a different accounting product - nothing was changed.",
            "المنتج المطابق في Shopify مرتبط بالفعل بمنتج محاسبي آخر - لم يتم تغيير أي شيء.",
          ),
        });
      } else if (outcomeStatus === "skipped-locked") {
        notifyError({
          language,
          title: translate("Try again", "حاول مرة أخرى"),
          message: translate("Another sync for this product is already running - try again shortly.", "هناك مزامنة أخرى لهذا المنتج قيد التشغيل بالفعل - حاول مرة أخرى بعد قليل."),
        });
      } else if (outcomeStatus === "skipped-nothing-to-archive" || outcomeStatus === "skipped-unchanged") {
        notifySuccess({
          language,
          title: translate("Nothing to do", "لا يوجد شيء لتنفيذه"),
          message: translate("Already up to date on Shopify.", "محدّث بالفعل على Shopify."),
        });
      } else {
        notifySuccess({
          language,
          title: translate("Success", "نجاح"),
          message: translate("Shopify sync completed", "تمت مزامنة Shopify بنجاح"),
        });
      }
      await fetchStatus();
    } catch (err) {
      notifyError({
        language,
        title: translate("Sync failed", "فشلت المزامنة"),
        message: err instanceof Error ? err.message : translate("Something went wrong", "حدث خطأ ما"),
      });
    } finally {
      setActionLoading(null);
      closeForceModal();
    }
  }

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{translate("Shopify Synchronization", "مزامنة Shopify")}</h3>
        <div className="flex items-center gap-2">
          {statusLoading && <Loader size="xs" />}
          <Tooltip label={translate("Refresh status", "تحديث الحالة")}>
            <Button variant="subtle" color="dark" size="xs" px="xs" onClick={fetchStatus} disabled={statusLoading}>
              <solidIcons.ArrowPath size={16} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {status ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Sync Status", "حالة المزامنة")}</span>
              <StatusBadge status={status.lastSyncStatus} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Shopify Product ID", "معرّف المنتج في Shopify")}</span>
              <span className="text-sm font-medium">{status.shopifyProductId ?? translate("Not yet synced", "لم تتم المزامنة بعد")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Last Synced At", "آخر مزامنة")}</span>
              <span className="text-sm font-medium">
                {status.lastSyncedAt ? new Date(status.lastSyncedAt).toLocaleString(translate("en-US", "ar-EG")) : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{translate("Shopify Variant IDs", "معرّفات المتغيرات في Shopify")}</span>
              <span className="text-sm font-medium">
                {status.variants.length > 0
                  ? status.variants.map((v) => v.shopifyVariantId).join(", ")
                  : translate("None yet", "لا يوجد بعد")}
              </span>
            </div>
          </div>

          {status.lastSyncError && (
            <Alert color="red" icon={<solidIcons.ExclamationCircle />} title={translate("Last Sync Error", "آخر خطأ في المزامنة")}>
              <span className="break-words text-xs">{status.lastSyncError}</span>
            </Alert>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              size="xs"
              variant="light"
              loading={actionLoading === "sync"}
              disabled={actionLoading !== null}
              leftSection={<outlineIcons.ArrowUpOnSquare size={16} />}
              onClick={() => runAction("sync", "sync")}
            >
              {translate("Sync Product to Shopify", "مزامنة المنتج مع Shopify")}
            </Button>
            <Button
              size="xs"
              variant="light"
              color="grape"
              loading={actionLoading === "inventory"}
              disabled={actionLoading !== null}
              leftSection={<solidIcons.ArrowPath size={16} />}
              onClick={() => runAction("inventory", "sync-inventory")}
            >
              {translate("Sync Inventory to Shopify", "مزامنة المخزون مع Shopify")}
            </Button>
            <Button
              size="xs"
              variant="light"
              color="orange"
              disabled={actionLoading !== null}
              leftSection={<outlineIcons.ExclamationCircle size={16} />}
              onClick={openForceModal}
            >
              {translate("Force Full Sync", "مزامنة كاملة إجبارية")}
            </Button>
          </div>
        </>
      ) : (
        !statusLoading && (
          <p className="text-sm text-gray-500">
            {translate("Shopify sync status is unavailable right now.", "حالة مزامنة Shopify غير متاحة حاليًا.")}
          </p>
        )
      )}

      <Modal opened={forceModalOpened} onClose={closeForceModal} title={translate("Force Full Sync?", "تأكيد المزامنة الكاملة الإجبارية؟")}>
        <div className="flex flex-col gap-3">
          <Alert color="orange" icon={<solidIcons.ExclamationCircle />}>
            {translate(
              "This re-sends every field and every variant's inventory to Shopify, even if nothing changed. Use this only to fix a mismatch - it is not needed for normal edits.",
              "سيؤدي هذا إلى إعادة إرسال جميع الحقول ومخزون جميع المتغيرات إلى Shopify، حتى لو لم يتغير شيء. استخدم هذا فقط لإصلاح عدم تطابق - وهو غير ضروري للتعديلات العادية.",
            )}
          </Alert>
          <div className="flex items-center gap-2">
            <Button size="sm" color="orange" loading={actionLoading === "force"} onClick={() => runAction("force", "force-full-sync")}>
              {translate("Force Sync", "تأكيد المزامنة")}
            </Button>
            <Button variant="light" color="dark" size="sm" onClick={closeForceModal} disabled={actionLoading === "force"}>
              {translate("Cancel", "إلغاء")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
