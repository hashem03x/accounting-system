import { NavigateFunction } from "react-router-dom";
import { ApiRequestOptions } from "@/types/api";
import { WebsitePaymentMethod } from "@/types/payment";
import { Address } from "@/types/user";
import { Cart } from "@/types/cart";
import paths from "@/utils/constants/paths";
import { isCodWebsitePayment, isWalletWebsitePayment } from "@/utils/constants/payment-methods";
import { trackEvent } from "@/utils/helpers/facebook-pixel";
import { Language } from "@/types/language";

type CheckoutRequest = (options: ApiRequestOptions) => Promise<{
  cart: Cart;
  order: { code: string; totalAmount: number };
  paymentLink?: string;
}>;

interface SubmitCheckoutSessionParams {
  request: CheckoutRequest;
  language: string;
  paymentMethod: WebsitePaymentMethod;
  selectedAddress: Address;
  walletNumber: string;
  needCardReader: boolean;
  translate: (en: string, ar: string) => string;
  navigate: NavigateFunction;
  setCart: (cart: Cart) => void;
}

export default async function submitCheckoutSession({
  request,
  language,
  paymentMethod,
  selectedAddress,
  walletNumber,
  needCardReader,
  translate,
  navigate,
  setCart,
}: SubmitCheckoutSessionParams) {
  const res = await request({
    language: language as Language,
    method: "POST",
    url: `sale-orders/online/checkout-session`,
    data: {
      paymentMethod,
      addressId: selectedAddress._id,
      phoneNumber: isWalletWebsitePayment(paymentMethod) ? walletNumber : undefined,
      needCardReader: isCodWebsitePayment(paymentMethod) ? needCardReader : undefined,
    },
  });

  if (isCodWebsitePayment(paymentMethod)) {
    setCart(res.cart);
    trackEvent("Purchase", {
      content_ids: [res.order.code],
      content_name: translate("Successful Payment", "عملية دفع ناجحة"),
      value: res.order.totalAmount,
      currency: "EGP",
    });
    navigate(`/${paths.orderReceived}`, { state: { order: res.order } });
  } else {
    window.location.href = res.paymentLink!;
  }
}
