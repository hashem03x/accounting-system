import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useDataHandler from "@/hooks/useDataHandler";
import apiRequest from "@/utils/helpers/api-request";
import handleRequest from "@/utils/helpers/handle-request";
import paths from "@/utils/constants/paths";
import { Product } from "@/types/product";
import { MainCategory } from "@/types/categories";
import { PaginatedData } from "@/types/global";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { outlineIcons } from "@/components/icons";
import ProductsList from "@/components/global/products-list";

export default function ProductsSection({ mainCategory }: { mainCategory: MainCategory }) {
  const { language, translate } = useLanguage();

  const { loading, setLoading, error, setError, data, setData } = useDataHandler<PaginatedData<Product>>({
    initialData: null,
  });

  function getProducts(id: string) {
    handleRequest(language, setLoading, setError, async () => {
      const response = await apiRequest({ url: `products`, params: { limit: 12, page: 1, mainCategoryId: id }, language });
      setData(response);
    });
  }

  useEffect(() => {
    getProducts(mainCategory._id);
  }, [mainCategory._id]);

  return (
    <section>
      <header className="bg-gray-100">
        <h2 className="py-5 text-center">{translate("Featured Products", "المنتجات المميزة")}</h2>
      </header>

      <div className="container flex flex-col gap-8 p-4">
        <ProductsList
          paginatedProducts={data}
          loading={loading}
          error={error}
          getProducts={() => getProducts(mainCategory._id)}
        />
        <footer className="mb-4">
          <Link to={`/${paths.products}`} state={{ mainCategoryId: mainCategory._id }}>
            <Button variant="light" fullWidth size="lg" leftSection={<outlineIcons.ShoppingBag size={20} />}>
              {translate("Browse Full Collection", "تسوق المجموعة الكاملة")}
            </Button>
          </Link>
        </footer>
      </div>
    </section>
  );
}
