import { useLanguage } from "@/context/LanguageContext";
import ErrorSection from "@/components/ui/sections/error";
import ProductCard from "@/components/global/product-card";
import { filterPaginatedProducts } from "@/utils/helpers/product-helpers";
import { PaginatedData } from "@/types/global";
import { Product } from "@/types/product";
import ratios from "@/utils/constants/ratios";
import emptyBox from "@/assets/empty-box.png";
import EmptySection from "@/components/ui/sections/empty";
import PaginationHandler from "@/components/ui/pagination-handler";

export default function ProductsList({
  paginatedProducts,
  loading,
  error,
  getProducts,
  activePage,
  setActivePage,
  limitation,
  wideMode = false,
}: {
  paginatedProducts: PaginatedData<Product>;
  loading?: boolean;
  error?: string;
  getProducts?: () => void;
  activePage?: number;
  setActivePage?: React.Dispatch<React.SetStateAction<number>>;
  limitation?: number;
  wideMode?: boolean;
}) {
  const { translate } = useLanguage();

  // Filter colors and variants
  const products = filterPaginatedProducts(paginatedProducts);

  if (products && limitation) products.data = products.data.slice(0, limitation);

  const GRID_CLASSES = `grid ${wideMode ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"} gap-x-2 gap-y-4 md:gap-x-4 md:gap-y-8`;

  return (
    <div className="flex flex-1 flex-col">
      {loading ? (
        <div className={GRID_CLASSES}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div style={{ aspectRatio: ratios.product }} className="w-full animate-pulse bg-gray-200" key={i}></div>
          ))}
        </div>
      ) : error ? (
        <ErrorSection
          errorTitle={translate("Error loading products", "خطأ في تحميل المنتجات")}
          errorMessage={error}
          button={getProducts ? { text: translate("Retry", "إعادة المحاولة"), onClick: getProducts } : undefined}
        />
      ) : (
        products &&
        (products.data.length === 0 ? (
          <EmptySection message={translate("No products found", "لا يوجد منتجات")} img={emptyBox} />
        ) : (
          <>
            {/* Products */}
            <div className={GRID_CLASSES}>
              {products.data.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {activePage && setActivePage && (
              <PaginationHandler paginatedData={products} activePage={activePage} setActivePage={setActivePage} />
            )}
          </>
        ))
      )}
    </div>
  );
}
