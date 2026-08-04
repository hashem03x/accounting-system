import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useMainCategories } from "@/context/MainCategoriesContext";
import useCategoryHelpers from "@/hooks/useCategoryHelpers";
import { ActionIcon, Button, Input, Menu } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import { useFilters } from "../context";

export default function Filters() {
  const { translate } = useLanguage();

  const { wideMode, setWideMode, mainCategoryFilter, isAnyFilterActive, clearFilters } = useFilters();

  return (
    <div className="flex flex-col gap-2 pt-3">
      <SearchAndSorting />

      <MainCategoriesFilter />

      {mainCategoryFilter && <SubcategoriesFilter />}

      <div className="flex items-center justify-between border-t py-2">
        {/* Clear Filters Button */}
        {isAnyFilterActive ? (
          <button
            onClick={clearFilters}
            className={`flex animate-fade-in items-center gap-1 rounded-full border bg-white bg-opacity-80 px-2 py-[5px] text-xs text-gray-800 hover:text-gray-950 sm:text-sm`}
          >
            <div className="flex-center h-5 w-5 rounded-full bg-gray-100">
              <solidIcons.XMark size={12} />
            </div>
            <div className="mx-1">{translate("Clear All Filters", "الغاء جميع الفلاتر")}</div>
          </button>
        ) : (
          <div />
        )}

        {/* Wide Mode Button */}
        <div className="flex justify-end gap-2">
          <ActionIcon
            variant="light"
            color={!wideMode ? "dark" : "gray"}
            title={translate("Compact mode", "وضع مكثف")}
            onClick={() => setWideMode(false)}
          >
            <solidIcons.LayoutGrid3 size={17} />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color={wideMode ? "dark" : "gray"}
            title={translate("Wide mode", "وضع واسع")}
            onClick={() => setWideMode(true)}
          >
            <solidIcons.LayoutGrid2 size={17} />
          </ActionIcon>
        </div>
      </div>
    </div>
  );
}

// =================================================================================================

function SearchAndSorting() {
  const { translate, translations } = useLanguage();

  const { keyword, setKeyword, sortBy, setSortBy } = useFilters();

  // The implementation of the keyword search is a little bit different as it uses a debounce

  const [searchValue, setSearchValue] = useState(keyword);

  useEffect(() => {
    if (searchValue === keyword) return;
    const timer = setTimeout(() => setKeyword(searchValue), 350);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    if (searchValue === keyword) return;
    setSearchValue(keyword);
  }, [keyword]);

  return (
    <div className="flex-center w-full gap-2">
      <Input
        // autoFocus
        value={searchValue}
        onChange={(e) => setSearchValue(e.currentTarget.value)}
        placeholder={translate("Search for a product", "ابحث عن منتج")}
        style={{ flex: 1 }}
        leftSection={<solidIcons.Search />}
        rightSectionPointerEvents="all" // Make the button clickable
        rightSection={
          searchValue && (
            <button onClick={() => setSearchValue("")}>
              <solidIcons.XMark />
            </button>
          )
        }
      />

      <Menu withArrow shadow="md" width={215} radius={7.5}>
        <Menu.Target>
          <Button variant="default" style={{ fontWeight: 400 }} leftSection={<solidIcons.Sort />}>
            <span className="text-sm">
              {translate("Sort by", "ترتيب حسب")} {` `}
              <span className="hidden text-sm sm:inline-block">
                {sortBy === "+price"
                  ? translate("Price: Low to High", "السعر: من الأقل للأعلى")
                  : sortBy === "-price"
                    ? translate("Price: High to Low", "السعر: من الأعلى للأقل")
                    : sortBy === null
                      ? translate("Newest", "الأحدث")
                      : ""}
              </span>
            </span>
          </Button>
        </Menu.Target>

        <Menu.Dropdown dir={translations.dir}>
          <Menu.Item onClick={() => setSortBy("+price")}>
            {sortBy === "+price" && <span className="mx-1 text-xs">✔</span>}
            {translate("Price: Low to High", "السعر: من الأقل للأعلى")}
          </Menu.Item>
          <Menu.Item onClick={() => setSortBy("-price")}>
            {sortBy === "-price" && <span className="mx-1 text-xs">✔</span>}
            {translate("Price: High to Low", "السعر: من الأعلى للأقل")}
          </Menu.Item>
          <Menu.Item onClick={() => setSortBy(null)}>
            {sortBy === null && <span className="mx-1 text-xs">✔</span>}
            {translate("Newest", "الأحدث")}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

// =================================================================================================

function MainCategoriesFilter() {
  const { translate } = useLanguage();

  const { data: mainCategories } = useMainCategories();

  const { mainCategoryFilter, setMainCategoryFilter } = useFilters();

  const handleCategoryClick = (id: string) => {
    if (mainCategoryFilter === id) return setMainCategoryFilter("");
    else setMainCategoryFilter(id);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="hide-scrollbar flex max-w-full gap-2 overflow-x-auto scroll-smooth">
        {mainCategories.map((category) => (
          <button
            key={category._id}
            onClick={() => handleCategoryClick(category._id)}
            className={`flex-center flex-1 text-nowrap rounded px-4 py-1 text-sm transition-colors sm:text-base ${
              mainCategoryFilter === category._id ? "bg-gray-800 text-white" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {translate(category.name.en, category.name.ar)}
          </button>
        ))}
      </div>
    </div>
  );
}

// =================================================================================================

function SubcategoriesFilter() {
  const { translate } = useLanguage();
  const { getSubcategoriesByMainCategoryId } = useCategoryHelpers();

  const { mainCategoryFilter, subcategoryFilter, setSubcategoryFilter } = useFilters();

  // Subcategories options depend on the selected main category
  const allSubcategories = getSubcategoriesByMainCategoryId(mainCategoryFilter);

  const handleSubCategoryChange = (id: string) => {
    if (subcategoryFilter === id) return setSubcategoryFilter("");
    else setSubcategoryFilter(id);
  };

  return (
    <div className="flex gap-1 overflow-auto pb-1.5 sm:gap-2">
      {allSubcategories.map((subcategory) => (
        <button
          key={subcategory._id}
          onClick={() => handleSubCategoryChange(subcategory._id)}
          className={`flex-center text-nowrap rounded-full border px-4 py-1 text-xs transition-colors sm:text-sm ${
            subcategoryFilter === subcategory._id ? "bg-gray-800 text-white" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {translate(subcategory.name.en, subcategory.name.ar)}
        </button>
      ))}
    </div>
  );
}
