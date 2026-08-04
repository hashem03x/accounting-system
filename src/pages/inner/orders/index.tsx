import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import { SalesOrder } from "@/types/orders";
import empty from "@/assets/order-tracking.png";
import EmptySection from "@/components/ui/sections/empty";
import ErrorSection from "@/components/ui/sections/error";
import LoadingSection from "@/components/ui/sections/loading";
import OrderCard from "./_components/order-card";

export default function Orders() {
  const { translate, language } = useLanguage();

  useDocumentTitle(`${translate("Orders", "الطلبات")}`);

  const {
    privateRequest,
    loading,
    setLoading,
    error,
    setError,
    data: orders,
    setData: setOrders,
  } = useDataHandler<SalesOrder[]>({ initialData: [], initialLoading: true });

  function handleLoadOrders() {
    const controller = new AbortController();
    const canceled = { current: false };

    const executeFetch = async () => {
      const response = await privateRequest({ url: "sale-orders/my-orders", signal: controller.signal, language });
      setOrders(response.data.reverse());
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
      <header>
        <h1>{translate("Orders", "الطلبات")}</h1>
      </header>

      {loading ? (
        <LoadingSection message={translate("Loading orders...", "جاري تحميل الطلبات...")} />
      ) : error ? (
        <ErrorSection
          errorTitle={translate("Error loading orders", "خطأ في تحميل الطلبات")}
          errorMessage={error}
          button={{ text: translate("Try again", "حاول مرة أخرى"), onClick: handleLoadOrders }}
        />
      ) : orders.length === 0 ? (
        <EmptySection message={translate("No Orders Found", "لا يوجد طلبات")} img={empty} />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
