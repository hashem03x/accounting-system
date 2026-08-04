import { useState } from "react";
import { useAbout } from "@/context/AboutContext";
import { useLanguage } from "@/context/LanguageContext";
import { useMainCategories } from "@/context/MainCategoriesContext";
import { useSubcategories } from "@/context/SubcategoriesContext";
import useCategoryHelpers from "@/hooks/useCategoryHelpers";
import useHasPermission from "@/hooks/useHasPermission";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import resources from "@/utils/constants/resources";
import actions from "@/utils/constants/actions";
import { Subcategory } from "@/types/categories";
import { Link } from "react-router-dom";
import { Button } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import ErrorAlert from "@/components/ui/error-alert";

export default function SubcategoriesSection() {
  const { translate, language } = useLanguage();

  const { data: about, setData: setAbout } = useAbout();

  const [subcategoriesBanners, setSubcategoriesBanners] = useState(about?.homeSubcategories as string[]);

  const { data: allSubcategories } = useSubcategories();
  const { data: allMainCategories } = useMainCategories();

  const { getMainCategoryNameOfSubcategory } = useCategoryHelpers();

  const banners: Subcategory[] = [];

  subcategoriesBanners.forEach((id) => {
    const subcategory = allSubcategories.find((cat) => cat._id === id);
    if (subcategory) banners.push(subcategory);
  });

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  function saveChanges() {
    handleRequest(language, setLoading, setError, async () => {
      await privateRequest({
        method: "PUT",
        url: `about-us/${import.meta.env.VITE_ABOUT_ID}`,
        data: { homeSubcategories: subcategoriesBanners },
        language,
      });

      setAbout((prev) => {
        if (!prev) return null;
        return { ...prev, homeSubcategories: subcategoriesBanners };
      });
    });
  }

  const canIUpdateCustomization = useHasPermission(resources.customization, actions.update);

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-2">
        <h3>{translate("Subcategories Banners", "بنرات الفئات الفرعية")}</h3>
        <p className="flex flex-wrap gap-1">
          <span>{translate("Subcategory banners are displayed on the", "بنرات الفئات الفرعية تظهر فى")}</span>
          <Link to="/" target="_blank" className="flex items-center gap-1 text-blue-500">
            <span>{translate("Home Page", "الصفحة الرئيسية")}</span>
            <solidIcons.ExternalLink className="w-3" />
          </Link>
          <span>{translate("beneath the hero section.", "اسفل قسم العرض الرئيسى.")}</span>
        </p>
      </header>

      <section className="flex flex-col gap-3">
        {banners.length === 0 ? (
          <div className="flex-center rounded-lg bg-gray-100 py-6 text-sm sm:text-base">
            {translate("No subcategories banners selected.", "لم يتم اختيار بنرات الفئات الفرعية.")}
          </div>
        ) : (
          banners.map((banner, index) => (
            <div
              key={banner._id}
              className="flex items-center justify-between gap-2 rounded-full bg-blue-50 px-6 py-3 text-blue-600"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                  {index + 1}
                </span>
                <div className="flex flex-col">
                  <h4>{translate(banner.name.en, banner.name.ar)}</h4>
                  <div className="text-xs text-gray-800 sm:text-sm">{getMainCategoryNameOfSubcategory(banner)}</div>
                </div>
              </div>
              {canIUpdateCustomization && (
                <button
                  onClick={() => setSubcategoriesBanners(subcategoriesBanners.filter((id) => id !== banner._id))}
                  className="flex-center h-6 w-6 rounded-full bg-red-500 p-0 text-sm text-white"
                  title={translate("Remove", "إزالة")}
                >
                  <solidIcons.XMark />
                </button>
              )}
            </div>
          ))
        )}

        {canIUpdateCustomization && (
          <>
            <Button
              mt={10}
              size="md"
              variant="gradient"
              radius={100}
              loading={loading}
              disabled={compareArrays(subcategoriesBanners, about?.homeSubcategories as string[])}
              onClick={saveChanges}
            >
              {translate("Save Changes", "حفظ التغييرات")}
            </Button>

            {error && <ErrorAlert error={error} />}
          </>
        )}
      </section>

      {/* Other Subcategories */}
      {canIUpdateCustomization && (
        <>
          <hr className="my-4" />

          <section className="flex flex-col gap-3">
            <h4>{translate("Other Subcategories", "الفئات الفرعية الأخرى")}</h4>

            {allMainCategories.map((mainCategory) => {
              const subcategoriesByMainCategory = allSubcategories.filter(
                (cat) => cat.mainCategory._id === mainCategory._id && !subcategoriesBanners.includes(cat._id),
              );

              return (
                <div key={mainCategory._id}>
                  <h5 className="mb-2">{translate(mainCategory.name.en, mainCategory.name.ar)}</h5>
                  {subcategoriesByMainCategory.length === 0 ? (
                    <div className="flex-center rounded-lg bg-gray-100 py-6 text-sm sm:text-base">
                      {translate("No more subcategories available.", "لا توجد المزيد من الفئات الفرعية المتاحة.")}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {subcategoriesByMainCategory.map((cat) => (
                        <Button
                          key={cat._id}
                          size="md"
                          variant="light"
                          leftSection={<solidIcons.Plus />}
                          onClick={() => setSubcategoriesBanners([...subcategoriesBanners, cat._id])}
                          title={translate("Add to Subcategories Banners", "إضافة إلى بنرات الفئات الفرعية")}
                        >
                          {translate(cat.name.en, cat.name.ar)}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}

function compareArrays(arr1: any[], arr2: any[]) {
  return arr1.length === arr2.length && arr1.every((item, index) => item === arr2[index]);
}
