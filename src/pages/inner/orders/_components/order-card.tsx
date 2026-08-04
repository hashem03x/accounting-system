import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { SalesOrder } from "@/types/orders";
import { formatDateAndTime } from "@/utils/helpers/date-formaters";
import { getOrderStatusLabel, isCanceledOrder, isDeliveredOrder, isPendingOrder } from "@/utils/constants/order-statuses";
import InfoItem from "@/components/ui/info-item";

export default function OrderCard({ order }: { order: SalesOrder }) {
  const { translate, language, translations } = useLanguage();

  const navigate = useNavigate();

  return (
    <div
      className="flex cursor-pointer flex-col gap-2 rounded-lg border bg-gray-50 p-4 hover:bg-gray-100"
      onClick={() => navigate(`${order._id}`)}
    >
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h4>
          {translate("Order ID", "رقم الطلب")}: {order._id}
        </h4>

        <span
          className={`rounded-lg px-2 py-1 text-xs font-medium text-white ${isPendingOrder(order.orderStatus) ? "bg-orange-500" : isDeliveredOrder(order.orderStatus) ? "bg-green-600" : isCanceledOrder(order.orderStatus) ? "bg-gray-800" : ""}`}
        >
          {getOrderStatusLabel(order.orderStatus, language)}
        </span>
      </header>

      <div className="flex flex-col gap-2 text-gray-800">
        <InfoItem label={translate("Date & Time", "التاريخ والوقت")} value={formatDateAndTime(order.createdAt, language)} />
        <InfoItem
          label={translate("Total Amount", "المبلغ الإجمالي")}
          value={`${order.totalAmountPlusShipping} ${translations.currency}`}
        />
      </div>

      <h5>{translate("Order Items", "عناصر الطلب")}</h5>
      <div className="grid grid-cols-3 gap-2">
        {order.items.map((item) => (
          <div key={item._id} className="flex items-center gap-1 text-gray-800">
            <span>&#8226;</span> {/* ASCII code for the bullet point (•) */}
            <p>{translate(item.variant.product.title.en, item.variant.product.title.ar)}</p>
            <span>&#215;</span> {/* ASCII code for the multiplication symbol (×) */}
            <span>{item.starterQuantity - item.returnedQuantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
