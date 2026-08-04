import { Link } from "react-router-dom";
import { useAbout } from "@/context/AboutContext";
import { useLanguage } from "@/context/LanguageContext";
import { useSubcategories } from "@/context/SubcategoriesContext";
import { Subcategory } from "@/types/categories";
import useCategoryHelpers from "@/hooks/useCategoryHelpers";
import paths from "@/utils/constants/paths";
import ratios from "@/utils/constants/ratios";
import Img from "@/components/ui/img";

export default function SubCategoriesSections() {
  const { translate } = useLanguage();

  const { data: about } = useAbout();

  const { data: subcategories } = useSubcategories();
  const { getMainCategoryNameOfSubcategory } = useCategoryHelpers();

  if (!subcategories.length) return null;

  const banners: Subcategory[] = [];

  about?.homeSubcategories.forEach((id) => {
    const subcategory = subcategories.find((cat) => cat._id === id);
    if (subcategory) banners.push(subcategory);
  });

  return (
    <section className="container flex flex-col items-center justify-center gap-5 px-4 py-10 md:gap-10">
      {banners.map((banner, index) => (
        <div key={banner._id} className="relative w-full">
          <div className={`mx-auto aspect-square w-[400px] max-w-full xl:h-[325px]`}>
            {/* Image Holder */}
            <div
              className={`overflow-hidden md:absolute md:top-0 md:w-[400px] ${index % 2 === 0 ? "md:left-[0%] lg:left-[15%]" : "md:right-[0%] lg:right-[15%]"} `}
            >
              <Img
                width="100%"
                src={banner.image}
                alt={translate(banner.name.en, banner.name.ar)}
                aspectRatio={ratios.subcategory}
                className="rounded"
              />
            </div>

            {/* Content Box */}
            <div
              className={`absolute top-3/4 z-10 -translate-y-1/2 md:top-1/2 md:-translate-x-0 ${index % 2 === 0 ? "left-1/2 -translate-x-1/2 md:left-[45%] xl:left-[40%]" : "right-1/2 translate-x-1/2 md:right-[45%] xl:right-[40%]"}`}
            >
              <div
                style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}
                className={`flex skew-x-3 scale-75 transform flex-col items-center gap-6 rounded px-8 py-6 shadow-md sm:scale-100`}
              >
                <h2 className="text-nowrap text-[38px] tracking-wide" style={{ fontWeight: 500 }}>
                  {translate(banner.name.en, banner.name.ar)}
                </h2>

                <div>
                  <Link
                    to={`/${paths.products}?mainCategoryId=${banner.mainCategory._id}&subCategories=${banner._id}`}
                    className="w-fit text-nowrap rounded bg-black px-4 py-2 text-white transition-colors hover:bg-red-500"
                  >
                    {translate("Shop Now", "تسوق الآن")}
                  </Link>
                  <div className="mt-2 text-center text-xs text-gray-800 sm:mt-3">
                    {getMainCategoryNameOfSubcategory(banner)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
