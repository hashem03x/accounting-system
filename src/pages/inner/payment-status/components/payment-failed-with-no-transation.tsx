import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import paths from "@/utils/constants/paths";
import Img from "@/components/ui/img";
import { Button } from "@mantine/core";
import transactionFailedBlack from "@/assets/transaction-failed-black.png";

export default function PaymentFailedWithNoTransaction() {
  const { translate } = useLanguage();

  const navigate = useNavigate();

  return (
    <div className="flex-center flex-col gap-4 rounded-lg border p-8">
      <h2 className="font-semibold text-red-600">{translate("Your payment has failed", "فشلت عملية الدفع")}</h2>
      <p className="text-center">
        {translate("Please check your payment details and try again.", "يرجى التحقق من تفاصيل الدفع والمحاولة مرة أخرى.")}
      </p>
      <div className="flex-center my-2 h-40 w-60 max-w-full rounded-3xl bg-gray-50">
        <Img src={transactionFailedBlack} alt="Transaction Failed" height="125px" />
      </div>
      <p className="text-sm">{translate("Transaction not found", "لم يتم العثور على العملية")}</p>
      <Button variant="light" color="dark" onClick={() => navigate(`/${paths.checkout}`)}>
        {translate("Try Again", "حاول مرة أخرى")}
      </Button>
    </div>
  );
}
