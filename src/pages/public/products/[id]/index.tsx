import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import apiRequest from "@/utils/helpers/api-request";
import { filterProduct } from "@/utils/helpers/product-helpers";
import { Product as ProductType } from "@/types/product";
import { Review } from "@/types/review";
import ErrorSection from "@/components/ui/sections/error";
import LoadingSkeleton from "./components/skeleton";
import ProductLayout from "./layout";

export default function Product() {
  const { language, translate, translations } = useLanguage();

  const { user } = useUser();

  const { id } = useParams();

  const {
    loading,
    setLoading,
    error,
    setError,
    data: product,
    setData: setProduct,
    privateRequest,
  } = useDataHandler<ProductType | null>({ initialData: null, initialLoading: true });

  const [userHasBoughtThis, setUserHasBoughtThis] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<Review | null>(null);

  useDocumentTitle(
    `${translate(product?.title.en || "Product Details", product?.title.ar || "تفاصيل المنتج")} | ${translations.appName}`,
  );

  function getProduct() {
    handleRequest(language, setLoading, setError, async () => {
      const response = await apiRequest({ url: `products/${id}`, language });
      if (response.data.isDeleted === true || response.data.isAvailable === false) {
        setError(translate("Product is not available", "المنتج غير متوفر"));
        return;
      } else {
        const filteredProduct = filterProduct(response.data);
        setProduct(filteredProduct);
        // Get loggedin user review
        if (user) {
          const userHasBoughtProductResponse = await privateRequest({
            url: `users/has-bought/${response.data._id}`,
            language,
          });
          if (userHasBoughtProductResponse.data.hasBought) setUserHasBoughtThis(true);
          if (response.data.ratingsQuantity) {
            const reviewsResponse = await apiRequest({
              url: `reviews`,
              params: { user: user._id, product: response.data._id },
              language,
            });
            if (reviewsResponse.data.length) setUserReview(reviewsResponse.data[0]);
          }
        }
      }
    });
  }

  useEffect(() => {
    getProduct();
  }, [id]);

  return (
    <div className="root-flex-1 container flex flex-col gap-6 px-4 py-6">
      {/* Product Layout */}
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorSection
          errorTitle={translate("Error Loading Product", "خطأ في تحميل المنتج")}
          errorMessage={error}
          button={{ text: translate("Try Again", "حاول مرة أخرى"), onClick: getProduct }}
        />
      ) : (
        product && (
          <ProductLayout
            product={product}
            setProduct={setProduct}
            userReview={userReview}
            setUserReview={setUserReview}
            userHasBoughtThis={userHasBoughtThis}
          />
        )
      )}
    </div>
  );
}
