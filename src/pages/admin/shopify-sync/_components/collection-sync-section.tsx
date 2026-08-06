import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

const ACTIONS: SyncAction[] = [
  {
    key: "sync-collections",
    label: ["Sync Collections", "مزامنة المجموعات"],
    warning: [
      "Queues every already-synced product to have its Shopify tag and collection membership rechecked against its current subcategory. Products already correctly categorized are skipped - safe to run at any time.",
      "سيتم جدولة إعادة فحص وسم المنتج ومجموعته في Shopify لكل منتج تمت مزامنته بالفعل، مقابل الفئة الفرعية الحالية له. سيتم تخطي المنتجات المصنفة بشكل صحيح بالفعل - آمن للتشغيل في أي وقت.",
    ],
    url: "shopify/sync/collections",
  },
];

/**
 * "Sync Collections" (subcategory-based tag/collection reconciliation) - a scoped action that
 * only fixes Shopify tag + collection membership for products already imported into Shopify,
 * without touching price/images/variants like a full product sync would. Progress/success/
 * skipped/failed counts are surfaced through the same Queue Status + Sync Logs + Failed
 * Synchronizations sections every other bulk action here relies on, not a dedicated tracker.
 */
export default function CollectionSyncSection({ onActionTriggered }: { onActionTriggered: () => void }) {
  const { translate } = useLanguage();
  const [selected, setSelected] = useState<SyncAction | null>(null);
  const [opened, { open, close }] = useDisclosure();

  function choose(action: SyncAction) {
    setSelected(action);
    open();
  }

  return (
    <div className="product-details-box">
      <h3>{translate("Collection Sync", "مزامنة المجموعات")}</h3>
      <p className="text-xs text-gray-500 sm:text-sm">
        {translate(
          "Each product's subcategory determines its Shopify tag and collection. Use this to fix categorization for products already on Shopify without re-syncing everything else.",
          "تحدد الفئة الفرعية لكل منتج وسمه ومجموعته في Shopify. استخدم هذا لإصلاح تصنيف المنتجات الموجودة بالفعل على Shopify دون إعادة مزامنة كل شيء آخر.",
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="xs" variant="light" color="teal" leftSection={<solidIcons.ArrowPath size={16} />} onClick={() => choose(ACTIONS[0]!)}>
          {translate(...ACTIONS[0]!.label)}
        </Button>
      </div>

      <ConfirmActionModal action={selected} opened={opened} onClose={close} onDone={onActionTriggered} />
    </div>
  );
}
