import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import AdminLayoutBox from "@/components/ui/admin-layout-box";
import ConnectionStatus from "./_components/connection-status";
import StoreInitSection from "./_components/store-init-section";
import QueueStatusSection from "./_components/queue-status-section";
import ProductSyncSection from "./_components/product-sync-section";
import InventorySyncSection from "./_components/inventory-sync-section";
import MappingSection from "./_components/mapping-section";
import FailedSyncsSection from "./_components/failed-syncs-section";
import LogsSection from "./_components/logs-section";

/**
 * "Shopify Synchronization" admin page - the control center for the Shopify integration
 * (connection status, product/inventory sync actions, mapping health, and a filterable log of
 * recent sync activity). Every action here proxies through the accounting backend's
 * `/api/v1/shopify/*` routes to the integration service's own admin API - this page never talks
 * to the integration service directly.
 *
 * `refreshKey` is bumped after any action completes so every section re-fetches its own data
 * (status/stats/logs) without a full page reload - each section fetches independently, so a slow
 * one never blocks the others from rendering.
 */
export default function ShopifySyncPage() {
  const { translate, translations } = useLanguage();
  useDocumentTitle(`${translations.pages.shopifySync} | ${translations.adminPanel}`);

  const [refreshKey, setRefreshKey] = useState(0);
  const bumpRefresh = () => setRefreshKey(k => k + 1);

  return (
    <AdminLayoutBox
      header={{
        title: translations.pages.shopifySync,
        backLink: true,
        subTitle: translate(
          "Manage and monitor product/inventory synchronization with Shopify.",
          "إدارة ومراقبة مزامنة المنتجات والمخزون مع Shopify.",
        ),
      }}
    >
      <div className="flex flex-col gap-4">
        <StoreInitSection refreshKey={refreshKey} onActionTriggered={bumpRefresh} />
        <ConnectionStatus refreshKey={refreshKey} />
        <QueueStatusSection refreshKey={refreshKey} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ProductSyncSection onActionTriggered={bumpRefresh} />
          <InventorySyncSection onActionTriggered={bumpRefresh} />
        </div>
        <MappingSection refreshKey={refreshKey} onActionTriggered={bumpRefresh} />
        <FailedSyncsSection refreshKey={refreshKey} onActionTriggered={bumpRefresh} />
        <LogsSection refreshKey={refreshKey} />
      </div>
    </AdminLayoutBox>
  );
}
