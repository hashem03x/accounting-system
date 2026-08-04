import React, { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useParams, Link } from "react-router-dom";
import useDataHandler from "@/hooks/useDataHandler";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import handleRequest from "@/utils/helpers/handle-request";
import paths from "@/utils/constants/paths";
import { SalesOrder } from "@/types/orders";
import { Breadcrumbs, Button } from "@mantine/core";
import LoadingSection from "@/components/ui/sections/loading";
import ErrorSection from "@/components/ui/sections/error";
import OrderDetails from "./_components/order-details";

export default function Order() {
  const { translations, translate, language } = useLanguage();

  useDocumentTitle(`${translate("Order View", "عرض الطلب")} | ${translations.adminPanel}`);

  const { id } = useParams();

  const crumbs = [
    { title: translate("Orders", "الطلبات"), url: `/${paths.orders}` },
    { title: id, url: `/${paths.orders}/${id}` },
  ];

  const {
    privateRequest,
    loading,
    setLoading,
    error,
    setError,
    data: order,
    setData: setOrder,
  } = useDataHandler<SalesOrder | null>({ initialData: null, initialLoading: true });

  function handleLoadOrders() {
    const controller = new AbortController();
    const canceled = { current: false };

    const executeFetch = async () => {
      const response = await privateRequest({ url: `sale-orders/my-orders/${id}`, signal: controller.signal, language });
      setOrder(response.data);
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
    const cancelRequest = handleLoadOrders(); // This will send the request and return the function to cancel it.
    return cancelRequest; // This will be called when the component unmounts.
  }, []);

  return (
    <div className="root-flex-1 container flex flex-col gap-4 p-4">
      <Breadcrumbs>
        {crumbs.map(({ title, url }) => (
          <Link key={url} to={url} className="rounded text-sm font-semibold text-blue-500 hover:text-blue-400 sm:text-base">
            {title}
          </Link>
        ))}
      </Breadcrumbs>

      {loading ? (
        <LoadingSection message={translate("Loading order...", "جاري تحميل الطلب...")} />
      ) : error ? (
        <ErrorSection
          errorTitle={translate("Error loading order", "خطأ في تحميل الطلب")}
          errorMessage={error}
          button={{ text: translate("Try again", "حاول مرة أخرى"), onClick: handleLoadOrders }}
        />
      ) : (
        order && <OrderDetails order={order} setOrder={setOrder as React.Dispatch<React.SetStateAction<SalesOrder>>} />
      )}

      <Link to={`/${paths.orders}`} className="w-full">
        <Button variant="light" size="lg" radius="md" fullWidth>
          {translate("View All Orders", "عرض جميع الطلبات")}
        </Button>
      </Link>
    </div>
  );
}
