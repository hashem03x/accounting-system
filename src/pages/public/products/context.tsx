import { createContext, useContext, useState } from "react";
import { SetURLSearchParams, useSearchParams } from "react-router-dom";

type SortByParams = "+price" | "-price";

type FiltersContextProps = {
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  activePage: number;
  setActivePage: (page: number) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  mainCategoryFilter: string;
  setMainCategoryFilter: (mainCategory: string) => void;
  subcategoryFilter: string;
  setSubcategoryFilter: (subcategory: string) => void;
  sortBy: SortByParams | null;
  setSortBy: (sort: SortByParams | null) => void;
  isAnyFilterActive: boolean;
  clearFilters: () => void;
  wideMode: boolean;
  setWideMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FiltersContext = createContext<FiltersContextProps>({
  searchParams: new URLSearchParams(),
  setSearchParams: () => {},
  activePage: 1,
  setActivePage: () => {},
  keyword: "",
  setKeyword: () => {},
  mainCategoryFilter: "",
  setMainCategoryFilter: () => {},
  subcategoryFilter: "",
  setSubcategoryFilter: () => {},
  sortBy: null,
  setSortBy: () => {},
  isAnyFilterActive: false,
  clearFilters: () => {},
  wideMode: false,
  setWideMode: () => {},
});

export default function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const activePage = parseInt(searchParams.get("page") || "1");
  const keyword = searchParams.get("keyword") || "";
  const mainCategoryFilter = searchParams.get("mainCategoryId") || "";
  const subcategoryFilter = searchParams.get("subCategories") || "";
  const sortBy = (searchParams.get("sort") || null) as SortByParams | null;

  const updateFilter = (key: string, value: string) => {
    if (key !== "page") searchParams.set("page", "1");
    if (key === "mainCategoryId") searchParams.delete("subCategories");
    if (!value) searchParams.delete(key);
    else searchParams.set(key, value);
    setSearchParams(searchParams);
  };

  const setActivePage = (page: number) => updateFilter("page", page.toString());
  const setKeyword = (keyword: string) => updateFilter("keyword", keyword);
  const setSortBy = (sort: SortByParams | null) => updateFilter("sort", sort || "");
  const setMainCategoryFilter = (mainCategory: string) => updateFilter("mainCategoryId", mainCategory);
  const setSubcategoryFilter = (subcategory: string) => updateFilter("subCategories", subcategory);

  const isAnyFilterActive = !!keyword || !!mainCategoryFilter || !!subcategoryFilter || !!sortBy;

  const clearFilters = () => {
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  const [wideMode, setWideMode] = useState(false);

  return (
    <FiltersContext.Provider
      value={{
        searchParams,
        setSearchParams,
        activePage,
        setActivePage,
        keyword,
        setKeyword,
        mainCategoryFilter,
        setMainCategoryFilter,
        subcategoryFilter,
        setSubcategoryFilter,
        sortBy,
        setSortBy,
        isAnyFilterActive,
        clearFilters,
        wideMode,
        setWideMode,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export const useFilters = () => useContext(FiltersContext);
