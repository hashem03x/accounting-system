import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import useStringifyOnlineAddress from "@/hooks/useStringifyOnlineAddress";
import useGovernoratesHelpers from "@/hooks/useGovernoratesHelpers";
import useDocumentTitle from "@/hooks/useDocumentTitle";
import useDataHandler from "@/hooks/useDataHandler";
import paths from "@/utils/constants/paths";
import handleRequest from "@/utils/helpers/handle-request";
import submitCheckoutSession from "@/utils/helpers/submit-checkout-session";
import {
  getWebsitePaymentMethodLabel,
  isCardWebsitePayment,
  isWalletWebsitePayment,
  isCodWebsitePayment,
} from "@/utils/constants/payment-methods";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button, Alert } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import Img from "@/components/ui/img";
import cardImg from "@/assets/credit-card.png";
import walletImg from "@/assets/wallet.png";
import codImg from "@/assets/cod.png";
import Box from "./components/box";
import LoadingPayment from "./components/loading-payment";
import ProductItem from "./components/product-item";
import ErrorAlert from "@/components/ui/error-alert";

export default function ConfirmOrder() {
  const { language, translations, translate } = useLanguage();
  const { getGovernorateById } = useGovernoratesHelpers();
  const { data: cart, setData: setCart } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  useDocumentTitle(`${translate("Order Confirmation", "تأكيد الطلب")} | ${translations.appName}`);

  const selectedAddress = location.state?.selectedAddress;
  const paymentMethod = location.state?.paymentMethod;
  const walletNumber = location.state?.walletNumber;
  const needCardReader = location.state?.needCardReader || false;

  const stringifiedAddress = useStringifyOnlineAddress(selectedAddress);
  const governorate = getGovernorateById(selectedAddress.governorate);
  const shippingCost = governorate?.shippingCost || 0;

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  function handleSubmit() {
    handleRequest(language, setLoading, setError, async () => {
      await submitCheckoutSession({
        request: privateRequest,
        language,
        paymentMethod,
        selectedAddress,
        walletNumber,
        needCardReader,
        translate,
        navigate,
        setCart,
      });
    });
  }

  if (cart.cartItems.length === 0 || !selectedAddress || !paymentMethod) return <Navigate to={`/${paths.cart}`} />;

  const hasDiscount = !!cart.discount;

  return (
    <div className="container p-4">
      <header className="mb-6 flex items-center gap-4 border-b pb-4">
        <Link to={`/${paths.checkout}`}>
          <Button color="dark" variant="light">
            <solidIcons.ArrowLeft size={20} className={`${translate("rotate-0", "rotate-180")}`} />
          </Button>
        </Link>
        <h1 className="text-xl sm:text-2xl">{translate("Confirm Order", "تأكيد الطلب")}</h1>
      </header>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          {/* Address and Phone Number */}
          <Box
            title={translate("Shipping Address", "عنوان الشحن")}
            className="flex flex-col gap-4 rounded-lg border p-4 text-gray-800"
          >
            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold">{translate("Address", "العنوان")}</div>
              {stringifiedAddress}
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-sm font-bold">{translate("Phone Number", "رقم الهاتف")}</div>
              <span>{selectedAddress.phone}</span>
              <Alert variant="light" color="yellow" className="text-xs sm:text-sm" icon={<solidIcons.ExclamationCircle />}>
                {translate("We'll contact you at this number for delivery", "سنتواصل معك على هذا الرقم للتوصيل")}
              </Alert>
            </div>
          </Box>

          {/* Order Items */}
          <Box title={translate("Order Items", "عناصر الطلب")} className="flex flex-col gap-4 rounded-lg border p-4">
            {cart.cartItems.map((item) => (
              <ProductItem key={item._id} item={item} />
            ))}
          </Box>
        </div>

        <div className="flex flex-col gap-4">
          {/* Order Summary */}
          <Box title={translate("Order Summary", "ملخص الطلب")} className="flex flex-col gap-4 rounded-lg border p-4">
            <div className="flex justify-between">
              <p>{translate("Subtotal", " المجموع الفرعي")}</p>
              <p className={hasDiscount ? "line-through" : ""}>
                {cart.totalCartPrice.toFixed(2)} {translations.currency}
              </p>
            </div>
            {hasDiscount && (
              <div className="flex justify-between">
                <p>{translate("After Discount", "بعد الخصم")}</p>
                <p>
                  {cart.totalCartPriceAfterDiscount.toFixed(2)} {translations.currency}
                </p>
              </div>
            )}
            <div className="flex justify-between">
              <p>{translate("Shipping Cost", "تكلفة الشحن")}</p>
              <p>
                {shippingCost.toFixed(2)} {translations.currency}
              </p>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-gray-800">
              <span>{translate("Total", "الإجمالي")}</span>
              <span>
                {(cart.totalCartPriceAfterDiscount + shippingCost).toFixed(2)} {translations.currency}
              </span>
            </div>
          </Box>

          {/* Payment Method */}
          <Box
            title={translate("Payment Method", "طريقة الدفع")}
            className="flex items-center gap-4 rounded-md border bg-gray-50 p-3"
          >
            <Img
              src={
                isCardWebsitePayment(paymentMethod)
                  ? cardImg
                  : isWalletWebsitePayment(paymentMethod)
                    ? walletImg
                    : isCodWebsitePayment(paymentMethod)
                      ? codImg
                      : ""
              }
              alt={translate("Payment Method", "طريقة الدفع")}
              height="45px"
            />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-gray-800 sm:text-sm">
                {getWebsitePaymentMethodLabel(paymentMethod, language)}
              </span>
              <p className="text-xs sm:text-sm">{isWalletWebsitePayment(paymentMethod) && walletNumber}</p>
            </div>
          </Box>

          {/* Proceed to Payment */}
          <div className="flex flex-col gap-2">
            <Button fullWidth size="xl" disabled={loading} onClick={handleSubmit}>
              {isCodWebsitePayment(paymentMethod)
                ? translate("Confirm Order", "تأكيد الطلب")
                : translate("Proceed to Payment", "اتمام عملية الدفع")}
            </Button>
          </div>

          {error && <ErrorAlert error={error} />}
          {loading && <LoadingPayment />}
        </div>
      </div>
    </div>
  );
}
