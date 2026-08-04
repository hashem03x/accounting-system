import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@mantine/core";
import { outlineIcons, solidIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

const ACTIONS: SyncAction[] = [
  {
    key: "sync-all",
    label: ["Sync All Products to Shopify", "مزامنة جميع المنتجات مع Shopify"],
    warning: [
      "Queues every product to be re-checked against Shopify. Only products that actually changed are re-sent - safe to run at any time.",
      "سيتم جدولة إعادة فحص جميع المنتجات مقابل Shopify. سيتم إعادة إرسال المنتجات التي تغيرت فعليًا فقط - آمن للتشغيل في أي وقت.",
    ],
    url: "shopify/sync/products",
  },
  {
    key: "dry-run",
    label: ["Dry Run Product Sync", "تشغيل تجريبي لمزامنة المنتجات"],
    warning: [
      "Runs the exact same check as 'Sync All Products' but never actually calls Shopify - only logs what WOULD be sent, for previewing before a real sync.",
      "يقوم بنفس فحص 'مزامنة جميع المنتجات' لكن دون استدعاء Shopify فعليًا - يسجل فقط ما كان سيتم إرساله، للمعاينة قبل مزامنة حقيقية.",
    ],
    url: "shopify/sync/products",
    body: { dryRun: true },
  },
  {
    key: "force-full",
    label: ["Force Full Product Sync", "مزامنة كاملة إجبارية للمنتجات"],
    warning: [
      "Re-sends EVERY field of EVERY mapped product and variant to Shopify, even if nothing changed. Use this only to fix a suspected mismatch - it is much heavier than a normal sync.",
      "سيعيد إرسال جميع حقول جميع المنتجات والمتغيرات المرتبطة إلى Shopify، حتى لو لم يتغير شيء. استخدم هذا فقط لإصلاح عدم تطابق مشتبه به - وهو أثقل بكثير من المزامنة العادية.",
    ],
    url: "shopify/sync/products/full",
  },
];

export default function ProductSyncSection({ onActionTriggered }: { onActionTriggered: () => void }) {
  const { translate } = useLanguage();
  const [selected, setSelected] = useState<SyncAction | null>(null);
  const [opened, { open, close }] = useDisclosure();

  function choose(action: SyncAction) {
    setSelected(action);
    open();
  }

  return (
    <div className="product-details-box">
      <h3>{translate("Product Sync", "مزامنة المنتجات")}</h3>
      <p className="text-xs text-gray-500 sm:text-sm">
        {translate(
          "Global product actions. To sync a specific set of products, select them from the Products page and use 'Sync Selected'.",
          "إجراءات عامة للمنتجات. لمزامنة مجموعة محددة من المنتجات، حددها من صفحة المنتجات واستخدم 'مزامنة المحدد'.",
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="xs" variant="light" leftSection={<outlineIcons.ArrowUpOnSquare size={16} />} onClick={() => choose(ACTIONS[0]!)}>
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
