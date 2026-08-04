import { useLanguage } from "@/context/LanguageContext";
import { useMainCategories } from "@/context/MainCategoriesContext";
import LoadingSection from "@/components/ui/sections/loading";
import ErrorSection from "@/components/ui/sections/error";
import EmptySection from "@/components/ui/sections/empty";
import MainCategoryCard from "./components/main-category-card";

export default function Categories() {
  const { translate } = useLanguage();
  const { data: mainCategories, loading, error, reFetch } = useMainCategories();

  return (
    <div className="root-flex-1 container mx-auto flex flex-col p-8">
      <h1 className="mb-4 text-center">{translate("Shop by Category", "تسوق حسب الفئة")}</h1>

      <p className="mb-8 text-center">
        {translate(
          "Discover the best products from a wide range of categories",
          "اكتشف أفضل المنتجات من مجموعة واسعة من الفئات",
        )}
      </p>

      {loading ? (
        <LoadingSection message={translate("Loading categories...", "جاري تحميل الفئات...")} className="flex-1" />
      ) : error ? (
        <ErrorSection
          errorTitle={translate("Error loading categories", "خطأ في تحميل الفئات")}
          errorMessage={error}
          button={{ text: translate("Retry", "إعادة المحاولة"), onClick: reFetch }}
        />
      ) : mainCategories.length === 0 ? (
        <EmptySection useDefaultImg message={translate("No categories found", "لم يتم العثور على فئات")} />
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {mainCategories.map((category) => (
            <MainCategoryCard key={category._id} mainCategory={category} />
          ))}
        </div>
      )}
    </div>
  );
}
