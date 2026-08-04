import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { notifyError, notifySuccess } from "@/utils/helpers/notifiers";
import { Alert, Button, Menu } from "@mantine/core";
import { outlineIcons, solidIcons } from "@/components/icons";
import Modal from "@/components/ui/modal";

type GlobalAction = {
  key: "sync-all" | "sync-all-inventory" | "repair-mappings" | "retry-failed";
  path: string;
  label: [string, string];
  warning: [string, string];
};

const ACTIONS: GlobalAction[] = [
  {
    key: "sync-all",
    path: "sync-all",
    label: ["Sync All Products", "مزامنة جميع المنتجات"],
    warning: [
      "This queues every product in the catalog to be re-checked against Shopify. Only changed products are actually re-sent - this is safe to run at any time.",
      "سيتم جدولة إعادة فحص جميع المنتجات في الكتالوج مقابل Shopify. سيتم إعادة إرسال المنتجات التي تغيرت فقط - آمن للتشغيل في أي وقت.",
    ],
  },
  {
    key: "sync-all-inventory",
    path: "sync-all-inventory",
    label: ["Sync All Inventory", "مزامنة جميع المخزون"],
    warning: [
      "This queues every mapped variant's stock to be re-checked against Shopify. Only changed quantities are actually re-sent - this is safe to run at any time.",
      "سيتم جدولة إعادة فحص مخزون جميع المتغيرات المرتبطة مقابل Shopify. سيتم إعادة إرسال الكميات التي تغيرت فقط - آمن للتشغيل في أي وقت.",
    ],
  },
  {
    key: "repair-mappings",
    path: "repair-mappings",
    label: ["Repair Product Mapping", "إصلاح ربط المنتجات"],
    warning: [
      "This checks every stored Shopify link and removes any that point to a product or variant that no longer exists in Shopify, so the next sync can safely recreate it instead of failing.",
      "سيتم فحص كل رابط مخزّن مع Shopify وإزالة أي رابط يشير إلى منتج أو متغير لم يعد موجودًا في Shopify، حتى تتمكن المزامنة القادمة من إعادة إنشائه بأمان بدلاً من الفشل.",
    ],
  },
  {
    key: "retry-failed",
    path: "retry-failed",
    label: ["Retry Failed Syncs", "إعادة محاولة المزامنات الفاشلة"],
    warning: [
      "This re-attempts every product and inventory sync currently recorded as failed.",
      "ستتم إعادة محاولة كل مزامنة منتج ومخزون مسجلة حاليًا على أنها فاشلة.",
    ],
  },
];

/**
 * Global Shopify actions (Part 2) for the Products page header - each enqueues a background job
 * on the integration service (never runs inline, per "do not block the UI during
 * synchronization") and returns immediately, so this only ever shows a brief loading state on the
 * menu item itself, then a success/failure notification once the request is accepted.
 */
export default function ShopifyGlobalSyncActions() {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();

  const [selected, setSelected] = useState<GlobalAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure();

  function chooseAction(action: GlobalAction) {
    setSelected(action);
    open();
  }

  async function confirm() {
    if (!selected) return;
    setLoading(true);
    try {
      await privateRequest({ url: `shopify/${selected.path}`, method: "POST", language });
      notifySuccess({
        language,
        title: translate("Started", "بدأت"),
        message: translate("The action was queued and is running in the background.", "تمت جدولة الإجراء وهو قيد التشغيل في الخلفية."),
      });
      close();
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
    <>
      <Menu withArrow width={260} radius={7.5} shadow="md">
        <Menu.Target>
          <Button variant="light" color="indigo" leftSection={<solidIcons.ArrowPath />}>
            {translate("Shopify Sync", "مزامنة Shopify")}
          </Button>
        </Menu.Target>
        <Menu.Dropdown dir={translate("ltr", "rtl")}>
          {ACTIONS.map((action) => (
            <Menu.Item key={action.key} leftSection={<outlineIcons.ArrowUpOnSquare size={16} />} onClick={() => chooseAction(action)}>
              {translate(...action.label)}
            </Menu.Item>
          ))}
        </Menu.Dropdown>
      </Menu>

      <Modal opened={opened} onClose={close} title={selected ? translate(...selected.label) : ""}>
        {selected && (
          <div className="flex flex-col gap-3">
            <Alert color="orange" icon={<solidIcons.ExclamationCircle />}>
              {translate(...selected.warning)}
            </Alert>
            <div className="flex items-center gap-2">
              <Button size="md" loading={loading} onClick={confirm}>
                {translate("Confirm", "تأكيد")}
              </Button>
              <Button variant="light" color="dark" size="md" onClick={close} disabled={loading}>
                {translate("Cancel", "إلغاء")}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
