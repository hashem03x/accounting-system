import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { useDisclosure } from "@mantine/hooks";
import { Badge, Button, Loader, Progress } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import ConfirmActionModal, { type SyncAction } from "./confirm-action-modal";

type StoreInitStatus = "generating" | "uploading" | "importing" | "completed" | "failed";

type FailedProductEntry = { accountingProductId: string; title: string; error: string };
type DuplicateProductEntry = { accountingProductId: string; title: string; reason: string };

type StoreInitRun = {
  id: number;
  status: StoreInitStatus;
  phaseMessage: string | null;
  startedAt: string;
  finishedAt: string | null;
  productsImported: number;
  variantsImported: number;
  productsSkipped: number;
  missingImages: number;
  missingVariants: number;
  failedProducts: FailedProductEntry[];
  duplicateProducts: DuplicateProductEntry[];
  error: string | null;
};

type StoreInitStatusResponse = { initialized: boolean; run: StoreInitRun | null };

const IN_PROGRESS_STATUSES: StoreInitStatus[] = ["generating", "uploading", "importing"];

function formatTime(iso: string | null, language: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(language);
}

/**
 * The entire "PHASE 1 — AUTOMATIC INITIAL MIGRATION" experience: a single button that reads
 * every accounting product, uploads it to Shopify via the Bulk Operations API (staged upload +
 * `productSet` bulk mutation - the real API equivalent of the merchant-UI CSV importer, which has
 * no public API), polls until Shopify finishes, and builds permanent mappings directly from the
 * correlated results. The admin never leaves this page and never touches Shopify Admin.
 *
 * Once a run reaches "completed", the button becomes "Reinitialize Shopify Store" - a destructive,
 * confirm-gated re-import (the backend refuses a second run unless `reinitialize: true` is passed).
 */
export default function StoreInitSection({ refreshKey, onActionTriggered }: { refreshKey: number; onActionTriggered: () => void }) {
  const { language, translate } = useLanguage();
  const privateRequest = usePrivateRequest();
  const [data, setData] = useState<StoreInitStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [reinitOpened, { open: openReinit, close: closeReinit }] = useDisclosure(false);
  const pollTimer = useRef<ReturnType<typeof setTimeout>>();

  const fetchStatus = useCallback(async () => {
    try {
      const response = await privateRequest({ url: "shopify/store-init/status", language });
      setData(response.data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Fast polling only while a run is actually in progress - otherwise this section is as static
  // as everything else on the page (refetches on refreshKey, like its siblings).
  useEffect(() => {
    const inProgress = data?.run && IN_PROGRESS_STATUSES.includes(data.run.status);
    if (!inProgress) return;
    pollTimer.current = setTimeout(fetchStatus, 3000);
    return () => clearTimeout(pollTimer.current);
  }, [data, fetchStatus]);

  async function startInit(reinitialize: boolean) {
    setStarting(true);
    try {
      await privateRequest({ url: "shopify/store-init", method: "POST", data: { reinitialize }, language });
      await fetchStatus();
      onActionTriggered();
    } catch (err) {
      // Errors here (e.g. "already in progress") are shown via the same alert pattern the rest of
      // the page uses for failures - surfaced through fetchStatus's own error state instead of a
      // separate toast, since the backend's 409 body already explains why.
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      setStarting(false);
    }
  }

  async function retryFailed() {
    await privateRequest({ url: "shopify/store-init/retry-failed", method: "POST", language });
    onActionTriggered();
  }

  const run = data?.run ?? null;
  const inProgress = run != null && IN_PROGRESS_STATUSES.includes(run.status);

  const reinitializeAction: SyncAction = {
    key: "reinitialize-store",
    label: [translate("Reinitialize Shopify Store", "إعادة تهيئة متجر Shopify"), ""] as [string, string],
    warning: [
      "This re-imports your ENTIRE catalog into Shopify again and can create duplicate products for anything that no longer matches an existing mapping. Only do this if you understand the consequences.",
      "سيؤدي هذا إلى إعادة استيراد الكتالوج بالكامل إلى Shopify مرة أخرى وقد ينشئ منتجات مكررة لأي شيء لم يعد يطابق ربطًا موجودًا. لا تفعل هذا إلا إذا كنت تفهم العواقب.",
    ] as [string, string],
    url: "shopify/store-init",
    body: { reinitialize: true },
  };

  return (
    <div className="product-details-box">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3>{translate("Sync Shopify Store", "مزامنة متجر Shopify")}</h3>
        {loading && <Loader size="xs" />}
      </div>
      <p className="text-xs text-gray-500">
        {translate(
          "One-click initial migration: reads every accounting product, imports it into Shopify via the official Bulk Operations API, and builds permanent mappings automatically. No CSV download, no Shopify Admin visit.",
          "ترحيل أولي بنقرة واحدة: يقرأ كل منتج محاسبي، ويستورده إلى Shopify عبر واجهة برمجة العمليات المجمعة الرسمية، وينشئ الروابط الدائمة تلقائيًا. لا تنزيل CSV، ولا زيارة لوحة تحكم Shopify."
        )}
      </p>

      {!run && !loading && (
        <Button size="sm" loading={starting} onClick={() => startInit(false)}>
          {translate("Initialize Shopify Store", "تهيئة متجر Shopify")}
        </Button>
      )}

      {run && (
        <div className="flex flex-col gap-3">
          {inProgress && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Loader size="xs" />
                <span className="text-sm font-medium">{run.phaseMessage ?? run.status}</span>
              </div>
              <Progress value={run.status === "generating" ? 20 : run.status === "uploading" ? 40 : 70} animated />
            </div>
          )}

          {run.status === "failed" && (
            <div className="flex flex-col gap-2 rounded-lg bg-red-50 p-3 text-red-700">
              <span className="text-xs font-medium">{translate("Run failed", "فشل التشغيل")}</span>
              <span className="break-words text-xs">{run.error}</span>
              <Button size="xs" className="w-fit" loading={starting} onClick={() => startInit(false)}>
                {translate("Initialize Shopify Store", "تهيئة متجر Shopify")}
              </Button>
            </div>
          )}

          {run.status === "completed" && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                <Stat label={translate("Products Imported", "المنتجات المستوردة")} value={run.productsImported} color="teal" />
                <Stat label={translate("Variants Imported", "المتغيرات المستوردة")} value={run.variantsImported} color="teal" />
                <Stat label={translate("Failed Products", "منتجات فشلت")} value={run.failedProducts.length} color="red" />
                <Stat label={translate("Duplicate Products", "منتجات مكررة")} value={run.duplicateProducts.length} color="yellow" />
                <Stat label={translate("Missing Images", "صور مفقودة")} value={run.missingImages} color="gray" />
                <Stat label={translate("Missing Variants", "متغيرات مفقودة")} value={run.missingVariants} color="gray" />
              </div>
              <span className="text-xs text-gray-500">
                {translate("Completed", "اكتمل")} · {formatTime(run.finishedAt, language)}
              </span>

              {run.failedProducts.length > 0 && (
                <div className="flex flex-col gap-2">
                  <Button size="xs" variant="light" color="red" className="w-fit" onClick={retryFailed}>
                    {translate("Retry Failed Products", "إعادة محاولة المنتجات الفاشلة")}
                  </Button>
                  <div className="max-h-40 overflow-y-auto rounded border border-gray-200 p-2 text-xs">
                    {run.failedProducts.map(f => (
                      <div key={f.accountingProductId} className="border-b border-gray-100 py-1 last:border-0">
                        <span className="font-medium">{f.title}</span> — <span className="text-gray-500">{f.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button size="xs" variant="light" color="red" leftSection={<solidIcons.ExclamationCircle size={14} />} className="w-fit" onClick={openReinit}>
                {translate("Reinitialize Shopify Store", "إعادة تهيئة متجر Shopify")}
              </Button>
            </>
          )}
        </div>
      )}

      <ConfirmActionModal action={reinitializeAction} opened={reinitOpened} onClose={closeReinit} onDone={onActionTriggered} />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500">{label}</span>
      <Badge size="lg" color={value > 0 ? color : "gray"} variant="light">
        {value}
      </Badge>
    </div>
  );
}
