import { useLanguage } from "@/context/LanguageContext";
import { MainCategory } from "@/types/categories";
import paths from "@/utils/constants/paths";
import { Link } from "react-router-dom";
import { outlineIcons } from "@/components/icons";

export default function MainCategoryCard({ mainCategory }: { mainCategory: MainCategory }) {
  const { translate } = useLanguage();

  return (
    <Link
      to={`/${paths.categories}/${mainCategory._id}`}
      className={`group flex transform cursor-pointer flex-col items-center justify-center rounded-xl border bg-gray-100 p-6 shadow-md transition-opacity hover:opacity-85`}
    >
      <div className="mb-6 text-gray-800 transition-transform duration-300 ease-out group-hover:rotate-12">
        {<outlineIcons.ShoppingBag size={50} />}
      </div>
      <h2 className="text-xl font-bold text-gray-800 transition-colors duration-300">
        {translate(mainCategory.name.en, mainCategory.name.ar)}
      </h2>
    </Link>
  );
}
