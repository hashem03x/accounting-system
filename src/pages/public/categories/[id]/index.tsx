import { useLanguage } from "@/context/LanguageContext";
import { Navigate, useParams } from "react-router-dom";
import { useMainCategories } from "@/context/MainCategoriesContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useCategoryHelpers from "@/hooks/useCategoryHelpers";
import paths from "@/utils/constants/paths";
import LoadingSection from "@/components/ui/sections/loading";
import ErrorSection from "@/components/ui/sections/error";
import SubcategoriesSection from "./components/subategories-section";
import ProductsSection from "./components/products-section";

export default function Category() {
  const { translate, translations } = useLanguage();

  const { id } = useParams();
  const { loading, error, reFetch } = useMainCategories();
  const { getMainCategoryById, getSubcategoriesByMainCategoryId } = useCategoryHelpers();

  const mainCategory = getMainCategoryById(id || "");
  const subcategories = getSubcategoriesByMainCategoryId(id || "");

  useDocumentTitle(`${translate(mainCategory?.name.en || "", mainCategory?.name.ar || "")} | ${translations.appName}`);

  return loading ? (
    <div className="container flex flex-1 flex-col p-4">
      <LoadingSection message={translate("Loading category...", "جارى تحميل الفئة...")} />
    </div>
  ) : error ? (
    <div className="container flex flex-1 flex-col p-4">
      <ErrorSection
        errorTitle={translate("Error loading category", "خطأ في تحميل الفئة")}
        errorMessage={error}
        button={{ text: translate("Retry", "إعادة المحاولة"), onClick: reFetch }}
      />
    </div>
  ) : mainCategory ? (
    <div className="flex flex-col gap-4">
      <SubcategoriesSection subcategories={subcategories} />
      <ProductsSection mainCategory={mainCategory} />
    </div>
  ) : (
    <Navigate to={`/${paths.categories}`} />
  );
}
