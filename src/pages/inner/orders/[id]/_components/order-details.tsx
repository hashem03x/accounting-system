import OrderPaymentStatus from "@/components/global/order-payment-status";
import OrderStatus from "@/components/global/order-status";
import InfoItem from "@/components/ui/info-item";
import { useLanguage } from "@/context/LanguageContext";
import useStringifyOnlineAddress from "@/hooks/useStringifyOnlineAddress";
import { SalesOrder } from "@/types/orders";
import { isDeliveredOrder } from "@/utils/constants/order-statuses";
import { formatDateAndTime } from "@/utils/helpers/date-formaters";
import { Table, Tooltip } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import ItemRow from "./item-row";

export default function OrderDetails({
  order,
  setOrder,
}: {
  order: SalesOrder;
  setOrder: React.Dispatch<React.SetStateAction<SalesOrder>>;
}) {
  const { translate, translations, language } = useLanguage();

  const lessThan15DaysPassed = new Date().getTime() - new Date(order.createdAt).getTime() < 15 * 24 * 60 * 60 * 1000;
  const isThereAnyReturnedItem = order.items.some((item) => item.returnedQuantity > 0);
  const isThereAnyReturningRequest = order.items.some((item) => item.quantityToBeReturned > 0);

  return (
    <div className="flex flex-col gap-2.5 rounded-lg border bg-gray-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-base sm:text-lg">
          {translate("Order ID", "معرف الطلب")}: {order._id}
        </h1>

        {order.isCodOrder && !order.isCodOrderConfirmed && (
          <Tooltip
            withArrow
            label={translate(
              "Our sales team will contact you soon to confirm your order with a small deposit",
              "سيتواصل معكم فريق المبيعات قريبًا لتأكيد الطلب عبر دفع عربون رمزي",
            )}
          >
            <div className="flex items-center gap-2">
              <solidIcons.XmarkCircle className="text-lg text-red-500" />
              <p className="uppercase">{translate("Order is not confirmed", "طلب غير مؤكد")}</p>
            </div>
          </Tooltip>
        )}
      </div>

      <InfoItem label={translate("Order #", "رقم الطلب")} value={order.code} />

      <InfoItem label={translate("Date & Time", "التاريخ والوقت")} value={formatDateAndTime(order.createdAt, language)} />

      {order.shippingAddress && (
        <>
          <InfoItem label={translate("Address", "العنوان")} value={useStringifyOnlineAddress(order.shippingAddress)} />
          <InfoItem label={translate("Phone Number", "رقم الهاتف")} value={order.shippingAddress?.phone} />
        </>
      )}

      {order.orderStatus && (
        <div className="flex items-center gap-2">
          <InfoItem label={translate("Order Status", "حالة الطلب")} value={<OrderStatus order={order} />} />
        </div>
      )}

      {order.orderStatus && order.deliveryDate && isDeliveredOrder(order.orderStatus) && (
        <InfoItem
          label={translate("Delivery Date", "تاريخ التوصيل")}
          value={formatDateAndTime(order.deliveryDate, language)}
        />
      )}

      <InfoItem
        label={translate("Order Amount", "سعر الطلب")}
        value={`${order.totalAmount.toFixed(2)} ${translations.currency}`}
      />

      <InfoItem
        label={translate("Shipping Cost", "تكلفة الشحن")}
        value={`${order.shippingCost?.toFixed(2)} ${translations.currency}`}
      />

      <InfoItem
        label={translate("Total Amount", "اجمالي المبلغ")}
        value={`${order.totalAmountPlusShipping.toFixed(2)} ${translations.currency}`}
      />

      <InfoItem label={translate("Payment Status", "حالة الدفع")} value={<OrderPaymentStatus order={order} />} />

      {/* Order Items Section */}
      <section className="mt-2 flex flex-col gap-2">
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h3>{translate("Order Items", "عناصر الطلب")}</h3>
          {order.couponDiscount > 0 && (
            <Tooltip
              withArrow
              label={translate(
                `You used a discount coupon and got an extra ${order.couponDiscount}% discount on your order.`,
                `لقد استخدمت كوبون خصم وحصلت على خصم اضافى بقيمة ${order.couponDiscount}% على طلبك.`,
              )}
            >
              <div className="flex items-center gap-1.5 text-green-500">
                <span className="text-sm font-semibold">{`${order.couponDiscount}%`}</span>
                <solidIcons.Tag />
              </div>
            </Tooltip>
          )}
        </header>

        <div className="overflow-x-auto rounded border bg-white">
          <Table className="text-nowrap text-sm" withColumnBorders verticalSpacing={1.5}>
            <Table.Thead>
              <Table.Tr h={40} className="text-gray-800">
                <Table.Th>{translate("Product Title", "عنوان المنتج")}</Table.Th>
                <Table.Th>{translate("Color", "اللون")}</Table.Th>
                <Table.Th>{translate("Size", "المقاس")}</Table.Th>
                <Table.Th>{translate("Quantity", "الكمية")}</Table.Th>
                {isThereAnyReturnedItem && <Table.Th>{translate("Returned", "مرتجع")}</Table.Th>}
                {isThereAnyReturningRequest && <Table.Th>{translate("Requesting Return", "طلب الإرجاع")}</Table.Th>}
                <Table.Th>{translate("Unit Price", "سعر الوحدة")}</Table.Th>
                <Table.Th className="min-w-[150px]">{translate("Discount", "الخصم")}</Table.Th>
                <Table.Th>{translate("After Discount", "بعد الخصم")}</Table.Th>
                <Table.Th>{translate("Subtotal", "المجموع")}</Table.Th>
                {lessThan15DaysPassed && <Table.Th w={10} />}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {order.items.map((item) => (
                <ItemRow
                  key={item._id}
                  item={item}
                  isThereAnyReturnedItem={isThereAnyReturnedItem}
                  isThereAnyReturningRequest={isThereAnyReturningRequest}
                  lessThan15DaysPassed={lessThan15DaysPassed}
                  setOrder={setOrder}
                />
              ))}
            </Table.Tbody>
          </Table>
        </div>

        {isThereAnyReturnedItem && (
          <div className="flex items-center gap-2">
            <solidIcons.ExclamationCircle size={12} className="text-yellow-500" />
            <p className="text-xs md:text-sm">
              {translate(`Some items have been returned in this order.`, `لقد تم إرجاع بعض العناصر في هذا الطلب.`)}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
