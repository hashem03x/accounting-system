import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@mantine/core";
import { outlineIcons, solidIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

const ACTIONS: SyncAction[] = [
  {
    key: "sync",
    label: ["Sync Inventory", "مزامنة المخزون"],
    warning: [
      "Queues every mapped variant's stock to be re-checked against Shopify. Only quantities that actually changed are re-sent - safe to run at any time.",
      "سيتم جدولة إعادة فحص مخزون جميع المتغيرات المرتبطة مقابل Shopify. سيتم إعادة إرسال الكميات التي تغيرت فعليًا فقط - آمن للتشغيل في أي وقت.",
    ],
    url: "shopify/sync/inventory",
  },
  {
    key: "dry-run",
    label: ["Dry Run Inventory Sync", "تشغيل تجريبي لمزامنة المخزون"],
    warning: [
      "Runs the exact same check as 'Sync Inventory' but never actually calls Shopify - only logs what WOULD be sent.",
      "يقوم بنفس فحص 'مزامنة المخزون' لكن دون استدعاء Shopify فعليًا - يسجل فقط ما كان سيتم إرساله.",
    ],
    url: "shopify/sync/inventory",
    body: { dryRun: true },
  },
  {
    key: "force",
    label: ["Force Inventory Sync", "مزامنة إجبارية للمخزون"],
    warning: [
      "Re-sends every mapped variant's current quantity to Shopify, even if it matches what was last pushed. Use this to fix inventory that may have drifted from a manual Shopify edit.",
      "سيعيد إرسال الكمية الحالية لكل متغير مرتبط إلى Shopify، حتى لو كانت مطابقة لآخر قيمة تم إرسالها. استخدم هذا لإصلاح مخزون ربما انحرف بسبب تعديل يدوي في Shopify.",
    ],
    url: "shopify/sync/inventory",
    body: { force: true },
  },
];

export default function InventorySyncSection({ onActionTriggered }: { onActionTriggered: () => void }) {
  const { translate } = useLanguage();
  const [selected, setSelected] = useState<SyncAction | null>(null);
  const [opened, { open, close }] = useDisclosure();

  function choose(action: SyncAction) {
    setSelected(action);
    open();
  }

  return (
    <div className="product-details-box">
      <h3>{translate("Inventory Sync", "مزامنة المخزون")}</h3>
      <p className="text-xs text-gray-500 sm:text-sm">
        {translate(
          "Accounting is always the source of truth for stock quantities.",
          "المحاسبة هي دائمًا مصدر الحقيقة لكميات المخزون.",
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="xs" variant="light" color="grape" leftSection={<solidIcons.ArrowPath size={16} />} onClick={() => choose(ACTIONS[0]!)}>
          {translate(...ACTIONS[0]!.label)}
        </Button>
        <Button size="xs" variant="light" color="gray" leftSection={<solidIcons.Eye size={16} />} onClick={() => choose(ACTIONS[1]!)}>
          {translate(...ACTIONS[1]!.label)}
        </Button>
        <Button size="xs" variant="light" color="orange" leftSection={<outlineIcons.ExclamationCircle size={16} />} onClick={() => choose(ACTIONS[2]!)}>
          {translate(...ACTIONS[2]!.label)}
        </Button>
      </div>

      <ConfirmActionModal action={selected} opened={opened} onClose={close} onDone={onActionTriggered} />
    </div>
  );
}
