import { useCallback, useEffect, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { Badge, Button, Loader } from "@mantine/core";
import { outlineIcons, solidIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

type Stats = {
  totalAccountingProducts: number;
  totalAccountingVariants: number;
  mappedProducts: number;
  mappedVariants: number;
  unmappedProducts: number;
  unmappedVariants: number;
};

const ACTIONS: SyncAction[] = [
  {
    key: "rebuild",
    label: ["Rebuild Mapping", "إعادة بناء الربط"],
    warning: [
      "Runs a full mapping repair AND a search for previously-unmapped variants that now match a Shopify product by SKU - the most thorough of the three mapping actions.",
      "يقوم بإصلاح شامل للربط بالإضافة إلى بحث عن المتغيرات غير المرتبطة سابقًا والتي تطابق الآن منتجًا في Shopify حسب SKU - الأكثر شمولاً من بين إجراءات الربط الثلاثة.",
    ],
    url: "shopify/mapping/rebuild",
  },
  {
    key: "find-missing",
    label: ["Find Missing Variants", "البحث عن المتغيرات المفقودة"],
    warning: [
      "Searches Shopify for a product matching each unmapped accounting variant's SKU and links it if found, instead of letting the next sync create a duplicate.",
      "يبحث في Shopify عن منتج يطابق SKU كل متغير محاسبي غير مرتبط ويربطه إذا تم العثور عليه، بدلاً من ترك المزامنة القادمة تنشئ نسخة مكررة.",
    ],
    url: "shopify/mapping/find-missing-variants",
  },
  {
    key: "repair",
    label: ["Repair Broken Mapping", "إصلاح الربط التالف"],
    warning: [
      "Removes any stored mapping whose Shopify product or variant no longer exists, so the next sync safely recreates it instead of failing.",
      "يزيل أي ربط مخزّن يشير إلى منتج أو متغير لم يعد موجودًا في Shopify، حتى تتمكن المزامنة القادمة من إعادة إنشائه بأمان بدلاً من الفشل.",
    ],
    url: "shopify/mapping/repair",
  },
];

export default function MappingSection({ refreshKey, onActionTriggered }: { refreshKey: number; onActionTriggered: () => void }) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<SyncAction | null>(null);
  const [opened, { open, close }] = useDisclosure();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await privateRequest({ url: "shopify/stats", language });
      setStats(response.data);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  function choose(action: SyncAction) {
    setSelected(action);
    open();
  }

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{translate("Mapping", "الربط")}</h3>
        {loading && <Loader size="xs" />}
      </div>

      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{translate("Mapped Products", "منتجات مرتبطة")}</span>
            <Badge color="teal" size="lg">
              {stats.mappedProducts}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{translate("Mapped Variants", "متغيرات مرتبطة")}</span>
            <Badge color="teal" size="lg">
              {stats.mappedVariants}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{translate("Unmapped Products", "منتجات غير مرتبطة")}</span>
            <Badge color={stats.unmappedProducts > 0 ? "orange" : "gray"} size="lg">
              {stats.unmappedProducts}
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-500">{translate("Unmapped Variants", "متغيرات غير مرتبطة")}</span>
            <Badge color={stats.unmappedVariants > 0 ? "orange" : "gray"} size="lg">
              {stats.unmappedVariants}
            </Badge>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="xs" variant="light" leftSection={<solidIcons.ArrowPath size={16} />} onClick={() => choose(ACTIONS[0]!)}>
          {translate(...ACTIONS[0]!.label)}
        </Button>
        <Button size="xs" variant="light" color="cyan" leftSection={<outlineIcons.ZoomIn size={16} />} onClick={() => choose(ACTIONS[1]!)}>
          {translate(...ACTIONS[1]!.label)}
        </Button>
        <Button size="xs" variant="light" color="red" leftSection={<outlineIcons.ExclamationCircle size={16} />} onClick={() => choose(ACTIONS[2]!)}>
          {translate(...ACTIONS[2]!.label)}
        </Button>
      </div>

      <ConfirmActionModal
        action={selected}
        opened={opened}
        onClose={close}
        onDone={() => {
          onActionTriggered();
          fetchStats();
        }}
      />
    </div>
  );
}
