import { useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import paths from "@/utils/constants/paths";
import { PaginatedData } from "@/types/global";
import { Product } from "@/types/product";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import Img from "@/components/ui/img";
import { outlineIcons } from "@/components/icons";
import ProductsList from "@/components/global/products-list";
import emptyWishlist from "@/assets/empty-wishlist.png";
import apiRequest from "@/utils/helpers/api-request";

function Wishlist() {
  const { language, translations, translate } = useLanguage();

  const { user } = useUser();

  useDocumentTitle(`${translate("Wishlist", "المفضلة")} | ${translations.appName}`);

  const {
    privateRequest,
    loading,
    setLoading,
    error,
    setError,
    data: products,
    setData: setProducts,
  } = useDataHandler<PaginatedData<Product>>({ initialData: null });

  const localWishlist = localStorage.getItem("wishlist");
  const parsedLocalWishlist = localWishlist ? JSON.parse(localWishlist) : [];

  function getProducts() {
    handleRequest(language, setLoading, setError, async () => {
      if (user) {
        if (user.wishlist.length > 0) {
          const response = await privateRequest({ url: "wishlist", language });
          setProducts(response);
        }
      } else {
        if (parsedLocalWishlist.length > 0) {
          const response = await apiRequest({ url: "products/by-ids", params: { ids: localWishlist || "[]" }, language });
          setProducts(response);
        }
      }
    });
  }

  useEffect(() => {
    getProducts();
  }, []);

  const emptyWishlistSection = (
    <section className="mb-4 flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border py-24">
      <Img src={emptyWishlist} alt={translate("Empty Wishlist", "قائمة فارغة")} className="h-24" />
      <h3 className="-mb-1 text-center">{translate("No products found", "لا توجد منتجات")}</h3>
      <p className="text-center">
        {translate("Your wishlist is currently empty.", "قائمة المفضلة الخاصة بك فارغة حاليًا.")}
      </p>
      <Link to={`/${paths.products}`}>
        <Button variant="light">{translate("Explore products", "استكشاف المنتجات")}</Button>
      </Link>
    </section>
  );

  return (
    <div className="root-flex-1 container flex flex-col gap-2 p-4">
      <h1>{translate("Wishlist", "المفضلة")}</h1>
      <p>{translate("Here you can view your wishlist products", "هنا يمكنك عرض منتجات قائمة المفضلة الخاصة بك")}</p>
      {(user && user.wishlist.length === 0) ||
      (!user && parsedLocalWishlist && parsedLocalWishlist.length === 0) ||
      products?.data.length === 0 ? (
        emptyWishlistSection
      ) : (
        <div className="flex flex-1 flex-col justify-between gap-4">
          <ProductsList paginatedProducts={products} loading={loading} error={error} getProducts={getProducts} />
          <Link to={`/${paths.products}`} className="my-8">
            <Button variant="light" fullWidth size="lg" leftSection={<outlineIcons.ShoppingBag size={21} />}>
              {translate("Explore More Products", "استكشاف المزيد من المنتجات")}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Wishlist;
