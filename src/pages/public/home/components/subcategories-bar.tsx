import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useSubcategories } from "@/context/SubcategoriesContext";
import paths from "@/utils/constants/paths";

export default function SubCategoriesBar() {
  const { translate } = useLanguage();
  const { data: subcategories } = useSubcategories();

  return (
    <div className="overflow-hidden bg-white px-10 py-4">
      <h2 className="mb-6 text-center text-xs font-semibold uppercase text-green-700">
        {translate("Shop by Category", "تسوق حسب الفئة")}
      </h2>

      <div className="flex gap-1 overflow-auto pb-1.5 sm:gap-2">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory._id}
            to={`/${paths.products}?mainCategoryId=${subcategory.mainCategory._id}&subCategories=${subcategory._id}`}
            className="flex min-w-[100px] flex-col items-center gap-2 rounded-lg bg-gray-50 py-3 text-center shadow-sm transition-colors hover:bg-gray-100"
          >
            <img src={subcategory.image} className="h-6 w-6" />
            <span className="text-[13px] font-bold text-gray-800">
              {translate(subcategory.name.en, subcategory.name.ar).toUpperCase()}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
