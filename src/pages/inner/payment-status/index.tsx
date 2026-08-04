import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useDataHandler from "@/hooks/useDataHandler";
import paths from "@/utils/constants/paths";
import handleRequest from "@/utils/helpers/handle-request";
import { formatDateAndTime } from "@/utils/helpers/date-formaters";
import { Button } from "@mantine/core";
import Img from "@/components/ui/img";
import ErrorSection from "@/components/ui/sections/error";
import LoadingSection from "@/components/ui/sections/loading";
import shippingImg from "@/assets/shipping.png";
import transactionFailed from "@/assets/transaction-failed-red.png";
import PaymentFailedWithNoTransaction from "./components/payment-failed-with-no-transation";
import { trackEvent } from "@/utils/helpers/facebook-pixel";

export default function PaymentStatus() {
  const { language, translate, translations } = useLanguage();
  useDocumentTitle(translate("Payment Status", "حالة الدفع"));
  const navigate = useNavigate();

  const [params] = useSearchParams();

  const [paymentInfo, setPaymentInfo] = useState({
    transactionId: "",
    createdAt: "",
    success: false,
    amount: 0,
  });

  const { privateRequest, loading, setLoading, setError, error } = useDataHandler({
    initialData: null,
    initialLoading: true,
  });

  async function getTransaction(id: string) {
    handleRequest(language, setLoading, setError, async () => {
      const { transaction } = await privateRequest({
        url: `transactions/${id}`,
        language,
      });
      setPaymentInfo({
        transactionId: transaction.transactionId,
        createdAt: transaction.createdAt,
        success: transaction.success,
        amount: transaction.amount,
      });
      if (transaction.success) {
        // Facebook Pixel tracking for successful payment
        trackEvent("Purchase", {
          content_ids: [transaction.transactionId],
          content_name: translate("Successful Payment", "عملية دفع ناجحة"),
          value: transaction.amount,
          currency: "EGP",
        });
      }
    });
  }

  useEffect(() => {
    const id = params.get("id");
    if (id) getTransaction(id);
    else setError("Transaction not found");
  }, []);

  return (
    <div className="root-flex-1 container mx-auto flex max-w-[500px] flex-col p-4 py-8">
      <h1 className="mb-6 text-center">{translate("Payment Status", "حالة الدفع")}</h1>
      {loading ? (
        <LoadingSection message={translate("Verifying payment status...", "التحقق من حالة الدفع...")} />
      ) : error === "Transaction not found" ? (
        <PaymentFailedWithNoTransaction />
      ) : error ? (
        <ErrorSection
          errorTitle={translate("Error verifying payment status", "خطأ في التحقق من حالة الدفع")}
          errorMessage={error}
          button={{
            text: translate("Try Again", "حاول مرة أخرى"),
            onClick: () => getTransaction(params.get("id") as string),
          }}
        />
      ) : (
        <div className="flex-center flex-col gap-4 rounded-lg border p-8">
          <div className="flex-center flex-col gap-4">
            {paymentInfo.success ? (
              <>
                <h2 className="font-semibold text-green-600">{translate("Payment Successful", "تم الدفع بنجاح")}</h2>
                <p className="text-center">
                  {translate(
                    "Your payment has been successfully processed and your order will be shipped soon.",
                    "تم معالجة دفعتك بنجاح وسيتم شحن طلبك قريبًا.",
                  )}
                </p>
                <div className="flex-center my-2 h-40 w-60 max-w-full rounded-3xl bg-green-50">
                  <div className="shake-truck">
                    <Img src={shippingImg} alt="Shipping" height="135px" className="running-truck" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-red-600">{translate("Payment Failed", "فشل الدفع")}</h2>
                <p className="text-center">
                  {translate("Your payment has failed. Please try again.", "فشلت عملية الدفع. يرجى المحاولة مرة أخرى.")}
                </p>
                <div className="flex-center my-2 h-40 w-60 max-w-full rounded-3xl bg-red-50">
                  <Img src={transactionFailed} alt="Payment Failed" height="125px" />
                </div>
              </>
            )}

            {/* The following will be displayed in both cases */}
            <p>
              {translate("Transaction ID", "رقم العملية")}: {paymentInfo.transactionId}
            </p>
            <p>
              {translate("Date", "التاريخ")}: {formatDateAndTime(paymentInfo.createdAt, language)}
            </p>

            {paymentInfo.success ? (
              <>
                <p>
                  {translate("Amount", "المبلغ")}: {paymentInfo.amount} {translations.currency}
                </p>

                <Button onClick={() => navigate(`/${paths.orders}`)}>{translate("View Orders", "عرض الطلبات")}</Button>
              </>
            ) : (
              <Button onClick={() => navigate(`/${paths.checkout}`)}>{translate("Try Again", "حاول مرة أخرى")}</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
