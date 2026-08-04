import { useLanguage } from "@/context/LanguageContext";
import { Subcategory } from "@/types/categories";
import paths from "@/utils/constants/paths";
import ratios from "@/utils/constants/ratios";
import Img from "@/components/ui/img";
import { Link } from "react-router-dom";

export default function SubcategoriesSection({ subcategories }: { subcategories: Subcategory[] }) {
  const { translate } = useLanguage();

  if (subcategories.length === 0) return null;

  return (
    <section>
      <div className="bg-gray-100">
        <h2 className="py-5 text-center">{translate("Popular Categories", "الفئات الشهيرة")}</h2>
      </div>

      <div className="container my-4 p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {subcategories.map((cat) => (
            <SubCategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SubCategoryCard({ category }: { category: Subcategory }) {
  const { translate } = useLanguage();

  return (
    <Link
      to={`/${paths.products}?mainCategoryId=${category.mainCategory._id}&subCategories=${category._id}`}
      className="relative aspect-square overflow-hidden rounded transition-opacity hover:opacity-90"
    >
      <Img
        src={category.image}
        alt={translate(category.name.en, category.name.ar)}
        aspectRatio={ratios.subcategory}
        width="100%"
      />
      <div className="absolute inset-0 bg-black bg-opacity-45" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-center text-lg text-white">{translate(category.name.en, category.name.ar)}</span>
      </div>
    </Link>
  );
}
