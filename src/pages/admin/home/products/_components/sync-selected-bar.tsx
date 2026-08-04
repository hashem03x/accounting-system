import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { notifyError, notifySuccess } from "@/utils/helpers/notifiers";
import { Alert, Button } from "@mantine/core";
import { outlineIcons, solidIcons } from "@/components/icons";
import Modal from "@/components/ui/modal";

type Kind = "products" | "inventory";

/**
 * "Sync Selected Products" / "Sync Selected Products Inventory" (Part 2) - appears above the
 * products table once at least one row is checked. Triggers the same queued background job the
 * Shopify Synchronization dashboard's global actions use (see accounting-backend's
 * shopifySyncController.js), scoped to exactly this selection instead of the whole catalog.
 */
export default function SyncSelectedBar({ selectedIds, onClear }: { selectedIds: string[]; onClear: () => void }) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [kind, setKind] = useState<Kind | null>(null);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure();

  function choose(k: Kind) {
    setKind(k);
    open();
  }

  async function confirm() {
    if (!kind) return;
    setLoading(true);
    try {
      await privateRequest({
        url: kind === "products" ? "shopify/sync/products" : "shopify/sync/inventory",
        method: "POST",
        data: { accountingProductIds: selectedIds },
        language,
      });
      notifySuccess({
        language,
        title: translate("Started", "بدأت"),
        message: translate(
          "The selected products were queued for sync and are running in the background.",
          "تمت جدولة المنتجات المحددة للمزامنة وهي قيد التشغيل في الخلفية.",
        ),
      });
      close();
      onClear();
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

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-blue-50 p-3">
        <span className="text-sm font-medium text-blue-800">
          {translate(`${selectedIds.length} product(s) selected`, `تم تحديد ${selectedIds.length} منتج`)}
        </span>
        <div className="flex items-center gap-2">
          <Button size="xs" variant="light" leftSection={<outlineIcons.ArrowUpOnSquare size={16} />} onClick={() => choose("products")}>
            {translate("Sync Selected Products", "مزامنة المنتجات المحددة")}
          </Button>
          <Button size="xs" variant="light" color="grape" leftSection={<solidIcons.ArrowPath size={16} />} onClick={() => choose("inventory")}>
            {translate("Sync Selected Inventory", "مزامنة مخزون المحدد")}
          </Button>
          <Button size="xs" variant="subtle" color="dark" onClick={onClear}>
            {translate("Clear", "إلغاء التحديد")}
          </Button>
        </div>
      </div>

      <Modal
        opened={opened}
        onClose={close}
        title={kind === "products" ? translate("Sync Selected Products", "مزامنة المنتجات المحددة") : translate("Sync Selected Inventory", "مزامنة مخزون المحدد")}
      >
        <div className="flex flex-col gap-3">
          <Alert color="orange" icon={<solidIcons.ExclamationCircle />}>
            {translate(
              `This will sync ${selectedIds.length} selected product(s) with Shopify.`,
              `سيتم مزامنة ${selectedIds.length} منتج محدد مع Shopify.`,
            )}
          </Alert>
          <div className="flex items-center gap-2">
            <Button size="sm" loading={loading} disabled={loading} onClick={confirm}>
              {translate("Confirm", "تأكيد")}
            </Button>
            <Button variant="light" color="dark" size="sm" onClick={close} disabled={loading}>
              {translate("Cancel", "إلغاء")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
