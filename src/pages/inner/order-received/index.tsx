import { useLanguage } from "@/context/LanguageContext";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import Img from "@/components/ui/img";
import checked from "@/assets/checked.gif";
import { Alert, Button } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import { SalesOrder } from "@/types/orders";
import { formatDateAndTime } from "@/utils/helpers/date-formaters";

export default function OrderReceived() {
  const { translate, translations, language } = useLanguage();

  useDocumentTitle(translate("Your order has been received", "تم استلام طلبك"));

  const location = useLocation();

  const order: SalesOrder | undefined = location.state?.order;

  if (!order) return null;

  return (
    <div className="root-flex-1 container mx-auto flex flex-col gap-6 p-4 py-10">
      <section className="flex-center flex-col gap-4">
        <Img src={checked} alt="Order Received" height="150px" />
        <h1 className="font-semibold text-green-600">
          {translate("Your order has been received successfully!", "تم استلام طلبكم بنجاح!")}
        </h1>
        <p className="text-center">
          {translate(
            "Thank you for your trust in us - we are always happy to serve you.",
            "شكرًا جزيلاً لثقتكم بنا، يسعدنا دائمًا خدمتكم.",
          )}
        </p>
        <Alert color="orange" className="max-w-[650px] text-center leading-7">
          {translate(
            "Our sales team will contact you soon to confirm your order with a small deposit, which will be deducted from the total amount on delivery. After confirmation, your order will be shipped promptly.",
            "سيتواصل معكم فريق المبيعات قريبًا لتأكيد الطلب عبر دفع عربون رمزي يتم خصمه من المبلغ المستحق عند الاستلام. وبعد التأكيد، سيتم شحن طلبكم مباشرة.",
          )}
        </Alert>
      </section>

      <section>
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 rounded-2xl border p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-800">{translate("Order Overview", "ملخص الطلب")}</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{translate("Order Number", "رقم الطلب")}</span>
              <span className="font-medium text-gray-800">{order.code}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{translate("Date & Time", "التاريخ والوقت")}</span>
              <span className="font-medium text-gray-800">{formatDateAndTime(order.createdAt, language)}</span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{translate("Total Amount", "اجمالي قيمة الطلب")}</span>
              <span className="font-medium text-gray-800">
                {order.totalAmount.toFixed(2)} {translations.currency}
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-gray-500">{translate("Shipping Cost", "تكلفة الشحن")}</span>
              <span className="font-medium text-gray-800">
                {order.shippingCost.toFixed(2)} {translations.currency}
              </span>
            </div>

            <div className="flex flex-col border-t pt-4 sm:col-span-2">
              <span className="text-sm text-gray-500">{translate("Total Cost", "المبلغ الإجمالي")}</span>
              <span className="text-xl font-bold text-gray-800">
                {order.totalAmountPlusShipping.toFixed(2)} {translations.currency}
              </span>
            </div>
          </div>

          <Link to={`/orders/${order._id}`} className="block w-full">
            <Button radius="md" fullWidth>
              {translate("View Order Details", "عرض تفاصيل الطلب")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
