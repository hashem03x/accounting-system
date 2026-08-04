import { useLanguage } from "@/context/LanguageContext";
import useCategoryHelpers from "@/hooks/useCategoryHelpers";
import paths from "@/utils/constants/paths";
import { Product } from "@/types/product";
import { Breadcrumbs } from "@mantine/core";
import { Link } from "react-router-dom";

export default function ProductBreadcrumbs({ product }: { product: Product }) {
  const { translate } = useLanguage();

  const { getMainCategoryNameById, getSubcategoryNameById } = useCategoryHelpers();

  const crumbs = [
    { title: translate("Products", "المنتجات"), url: `/${paths.products}` },
    {
      title: getMainCategoryNameById(product.category),
      url: `/${paths.products}?page=1&mainCategoryId=${product.category}`,
    },
    {
      title: getSubcategoryNameById(product.subcategory),
      url: `/${paths.products}?page=1&mainCategoryId=${product.category}&subCategories=${product.subcategory}`,
    },
    {
      title: translate(product.title.en, product.title.ar),
      url: `/${paths.products}/${product._id}`,
    },
  ];

  return (
    <Breadcrumbs>
      {crumbs.map(({ title, url }) => (
        <Link key={url} to={url} className="rounded text-sm font-semibold text-blue-500 hover:text-blue-400 sm:text-base">
          {title}
        </Link>
      ))}
    </Breadcrumbs>
  );
}
