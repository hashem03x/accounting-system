import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useDataHandler from "@/hooks/useDataHandler";
import apiRequest from "@/utils/helpers/api-request";
import handleRequest from "@/utils/helpers/handle-request";
import { DEFAULT_ITEMS_PER_PAGE } from "@/utils/constants";
import { PaginatedData } from "@/types/global";
import { Product } from "@/types/product";
import ProductsList from "@/components/global/products-list";
import Filters from "./components/Filters";
import { useFilters } from "./context";

const PRODUCTS_PER_PAGE = import.meta.env.VITE_PRODUCTS_PER_PAGE || DEFAULT_ITEMS_PER_PAGE;

const IGNORED_PARAMS = ["fbclid"];

export default function Layout() {
  const { language } = useLanguage();

  const { searchParams, activePage, setActivePage, wideMode } = useFilters();

  const {
    loading,
    setLoading,
    error,
    setError,
    data: paginatedProducts,
    setData: setPaginatedProducts,
  } = useDataHandler<PaginatedData<Product>>({ initialData: null, initialLoading: true });

  function handleLoadProducts() {
    const controller = new AbortController();
    const canceled = { current: false };

    const executeFetch = async () => {
      const response = await apiRequest({
        url: "products",
        params: {
          isDeleted: false,
          isAvailable: true,
          limit: PRODUCTS_PER_PAGE,
          ...Object.fromEntries([...searchParams.entries()].filter(([key]) => !IGNORED_PARAMS.includes(key))),
        },
        signal: controller.signal,
        language,
      });

      setPaginatedProducts(response);
    };

    handleRequest(language, setLoading, setError, executeFetch, canceled);

    // Return a function to cancel this request
    return () => {
      controller.abort();
      canceled.current = true;
    };
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    const cancelRequest = handleLoadProducts(); // This will send the request and return the function to cancel it.
    return cancelRequest; // This will be called when the component unmounts.
  }, [searchParams]);

  return (
    <div className="root-flex-1 container mb-4 flex flex-col px-4">
      {/* Filters */}
      <div className="sticky top-[80px] z-20 mb-3 border-b bg-white">
        <Filters />
      </div>

      {/* Content */}
      <ProductsList
        loading={loading}
        error={error}
        paginatedProducts={paginatedProducts}
        activePage={activePage}
        setActivePage={setActivePage as React.Dispatch<React.SetStateAction<number>>}
        wideMode={wideMode}
      />
    </div>
  );
}
