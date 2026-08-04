import { Link } from "react-router-dom";
import { useDisclosure } from "@mantine/hooks";
import { useLanguage } from "@/context/LanguageContext";
import useCategoryHelpers from "@/hooks/useCategoryHelpers";
import translate from "@/utils/helpers/translate";
import { MainCategory } from "@/types/categories";
import paths from "@/utils/constants/paths";
import { Collapse } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import { useMainCategories } from "@/context/MainCategoriesContext";

export default function MobileDrawerCategoriesButton({
  mainCategory,
  close,
}: {
  mainCategory: MainCategory;
  close: () => void;
}) {
  const { language } = useLanguage();
  const [opened, { toggle }] = useDisclosure(false);
  const { getSubcategoriesByMainCategoryId } = useCategoryHelpers();

  const mainCategories = useMainCategories();

  const isOnlyOneMainCategory = mainCategories.data.length === 1;

  return (
    <>
      {!isOnlyOneMainCategory && (
        <button
          onClick={toggle}
          className={`flex w-full items-center gap-4 px-4 py-3 text-lg ${opened ? "bg-gray-100" : ""}`}
        >
          {opened ? <solidIcons.AngleUp /> : <solidIcons.AngleDown />}
          <div>{translate(language, mainCategory.name.en, mainCategory.name.ar)}</div>
        </button>
      )}
      <Collapse in={isOnlyOneMainCategory ? true : opened}>
        <Link
          to={`${paths.categories}/${mainCategory._id}`}
          state={{ mainCategoryId: mainCategory._id }}
          className="flex w-full gap-4 px-5 py-[10px] transition-colors hover:bg-gray-100"
          onClick={close}
        >
          <div>{"\u2022"}</div>
          <div>{translate(language, "Shop All", "كل المنتجات")}</div>
        </Link>
        {getSubcategoriesByMainCategoryId(mainCategory._id).map((subCategory) => (
          <Link
            key={subCategory._id}
            to={`${paths.products}?mainCategoryId=${mainCategory._id}&subCategories=${subCategory._id}`}
            className="flex w-full gap-4 px-5 py-[10px] transition-colors hover:bg-gray-100"
            onClick={close}
          >
            <div>{"\u2022"}</div>
            <div>{translate(language, subCategory.name.en, subCategory.name.ar)}</div>
          </Link>
        ))}
      </Collapse>
    </>
  );
}
