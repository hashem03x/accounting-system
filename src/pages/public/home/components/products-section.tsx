import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useFetchingStatus from "@/hooks/useFetchingStatus";
import ProductsList from "@/components/global/products-list";
import { PaginatedData } from "@/types/global";
import { Product } from "@/types/product";
import apiRequest from "@/utils/helpers/api-request";
import handleRequest from "@/utils/helpers/handle-request";
import paths from "@/utils/constants/paths";
import { outlineIcons } from "@/components/icons";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";

export default function ProductsSection() {
  const { language, translate } = useLanguage();

  const [bestSellerProducts] = useState<PaginatedData<Product>>(null);
  const [newArrivalProducts, setNewArrivalProducts] = useState<PaginatedData<Product>>(null);

  const { loading, setLoading, error, setError } = useFetchingStatus();

  // useEffect(() => {
  //   handleRequest(language, setLoading, setError, async () => {
  //     const res = await apiRequest({
  //       url: `products`,
  //       params: { isDeleted: false, isAvailable: true, sort: "-totalSold" },
  //       language,
  //     });
  //     setBestSellerProducts(res);
  //   });
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    handleRequest(language, setLoading, setError, async () => {
      const res = await apiRequest({ url: `products`, params: { isDeleted: false, isAvailable: true }, language });
      setNewArrivalProducts(res);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderHeading = (title: string) => <h2 className="my-8 text-center text-3xl hover:text-gray-800">{title}</h2>;

  if (loading || error) return null;

  return (
    <section className="container px-2 py-2 sm:px-4">
      {false && (
        <>
          {renderHeading(translate("Best Sellers", "الأكثر مبيعاً"))}
          <ProductsList paginatedProducts={bestSellerProducts} limitation={4} />
          <div className="h-12" />
        </>
      )}

      {renderHeading(translate("New Arrivals", "أحدث المنتجات"))}
      <ProductsList paginatedProducts={newArrivalProducts} limitation={4} />
      <Link to={`/${paths.products}`}>
        <Button variant="light" fullWidth size="lg" mt={35} leftSection={<outlineIcons.ShoppingBag size={20} />}>
          {translate("Browse Full Collection", "تسوق المجموعة الكاملة")}
        </Button>
      </Link>
    </section>
  );
}
