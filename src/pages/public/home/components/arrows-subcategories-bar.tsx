// useEffect(() => {
//   const handleResize = () => {
//     const width = window.innerWidth;
//     if (width < 640)
//       setItemsPerPage(4); // Mobile
//     else if (width < 768)
//       setItemsPerPage(5); // Small Tablet
//     else if (width < 1024)
//       setItemsPerPage(6); // Tablet
//     else if (width < 1280)
//       setItemsPerPage(8); // Laptop
//     else setItemsPerPage(10); // Desktop
//   };

// Ideas:
// 1. Smooth swiping effect for mobile
// 2. Fix animation direction in case of RTL

import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useSubcategories } from "@/context/SubcategoriesContext";
import { Subcategory } from "@/types/categories";
import paths from "@/utils/constants/paths";
import { outlineIcons, solidIcons } from "@/components/icons";

const ITEM_WIDTH = 112;

function LTRBar({ subcategories, translate }: { subcategories: Subcategory[]; translate: Function }) {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const maxItems = Math.floor(screenWidth / ITEM_WIDTH);
      setItemsPerPage(Math.max(1, maxItems));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = useMemo(() => Math.ceil(subcategories.length / itemsPerPage), [subcategories.length, itemsPerPage]);

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const containerWidth = itemsPerPage * ITEM_WIDTH;
  const translateValue = page * containerWidth;

  return (
    <div className="overflow-hidden bg-white py-6">
      <h2 className="mb-6 text-center text-xs font-semibold uppercase text-green-700">
        {translate("Shop by Category", "تسوق حسب الفئة")}
      </h2>

      <div className="flex items-center justify-center gap-4 px-4">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 disabled:opacity-30"
        >
          <solidIcons.ArrowLeft />
        </button>

        <div className="relative overflow-hidden" style={{ width: `${containerWidth}px` }}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${translateValue}px)`,
              width: `${totalPages * containerWidth}px`,
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                className="flex flex-shrink-0 gap-1"
                style={{
                  width: `${containerWidth}px`,
                  justifyContent: "space-evenly",
                }}
              >
                {subcategories.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((subcategory) => (
                  <Link
                    key={subcategory._id}
                    to={`/${paths.products}?mainCategoryId=${subcategory.mainCategory._id}&subCategories=${subcategory._id}`}
                    className="flex flex-col items-center rounded bg-gray-50 py-2 text-center transition-colors hover:bg-gray-100"
                    style={{ width: `${ITEM_WIDTH}px` }}
                  >
                    <outlineIcons.Box className="mb-2 h-6 w-6 text-gray-600" />
                    <span className="text-[13px] font-bold text-gray-800">
                      {translate(subcategory.name.en, subcategory.name.ar).toUpperCase()}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={page === totalPages - 1}
          className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 disabled:opacity-30"
        >
          <solidIcons.ArrowRight />
        </button>
      </div>
    </div>
  );
}

// =============================================================

function RTLBar({ subcategories, translate }: { subcategories: Subcategory[]; translate: Function }) {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const maxItems = Math.floor(screenWidth / ITEM_WIDTH);
      setItemsPerPage(Math.max(1, maxItems));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = useMemo(() => Math.ceil(subcategories.length / itemsPerPage), [subcategories.length, itemsPerPage]);

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const containerWidth = itemsPerPage * ITEM_WIDTH;
  const translateValue = page * containerWidth;

  return (
    <div className="overflow-hidden bg-white py-6" dir="rtl">
      <h2 className="mb-6 text-center text-xs font-semibold uppercase text-green-700">
        {translate("Shop by Category", "تسوق حسب الفئة")}
      </h2>

      <div className="flex items-center justify-center gap-4 px-4">
        <button
          onClick={handleNext}
          disabled={page === totalPages - 1}
          className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 disabled:opacity-30"
        >
          {/* ArrowLeft rotated for RTL */}
          <solidIcons.ArrowLeft className="rotate-180 transform" />
        </button>

        <div className="relative overflow-hidden" style={{ width: `${containerWidth}px` }}>
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${translateValue}px)`,
              width: `${totalPages * containerWidth}px`,
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIndex) => (
              <div
                key={pageIndex}
                className="flex flex-shrink-0 gap-1"
                style={{
                  width: `${containerWidth}px`,
                  justifyContent: "space-evenly",
                }}
              >
                {subcategories.slice(pageIndex * itemsPerPage, (pageIndex + 1) * itemsPerPage).map((subcategory) => (
                  <Link
                    key={subcategory._id}
                    to={`/${paths.products}?mainCategoryId=${subcategory.mainCategory._id}&subCategories=${subcategory._id}`}
                    className="flex flex-col items-center rounded bg-gray-50 py-2 text-center transition-colors hover:bg-gray-100"
                    style={{ width: `${ITEM_WIDTH}px` }}
                  >
                    <outlineIcons.Box className="mb-2 h-6 w-6 text-gray-600" />
                    <span className="text-[13px] font-bold text-gray-800">
                      {translate(subcategory.name.en, subcategory.name.ar).toUpperCase()}
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="rounded-full bg-gray-200 p-2 text-gray-700 hover:bg-gray-300 disabled:opacity-30"
        >
          <solidIcons.ArrowRight className="rotate-180 transform" />
        </button>
      </div>
    </div>
  );
}

// =============================================================

export default function ArrowsSubcategoriesBar() {
  const { translate, translations } = useLanguage();
  const { data: subcategories } = useSubcategories();

  if (!subcategories.length) return null;

  const isRTL = translations.dir === "rtl";

  return isRTL ? (
    <RTLBar subcategories={subcategories} translate={translate} />
  ) : (
    <LTRBar subcategories={subcategories} translate={translate} />
  );
}
