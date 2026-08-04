import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@mantine/core";
import { Link } from "react-router-dom";
import paths from "@/utils/constants/paths";
import Img from "@/components/ui/img";
import ErrorSection from "@/components/ui/sections/error";
import LoadingSection from "@/components/ui/sections/loading";
import ProductInCart from "./product-in-cart";
import emptyCart from "@/assets/empty-cart.png";

export default function CartItems() {
  const { translate } = useLanguage();

  const { data: cart, loading: isCartLoading, error: cartError, reFetch } = useCart();

  const emptyCartSection = (
    <section className="flex-center flex-col gap-4" style={{ height: "100%", minHeight: "50vh" }}>
      <Img src={emptyCart} alt={translate("Empty Cart", "عربة فارغة")} className="h-24 opacity-85" />
      <h3 style={{ fontWeight: 500 }} className="text-center">
        {translate("No Items in Cart", "لا توجد عناصر في العربة")}
      </h3>
      <Link to={`/${paths.products}`}>
        <Button variant="light">{translate("Continue Shopping", "متابعة التسوق")}</Button>
      </Link>
    </section>
  );

  return (
    <div className="flex h-full flex-col gap-2">
      <h2 style={{ fontWeight: 500 }}>
        {translate("Items in Cart", "العناصر في العربة")}
        {cart.cartItems.length > 0 && <span className="to-gray-800"> ({cart.cartItems.length})</span>}
      </h2>

      <div className="flex flex-1 flex-col gap-4 rounded-lg border p-3 sm:p-4">
        {isCartLoading ? (
          <LoadingSection className="h-full" message={translate("Loading Cart...", "جاري تحميل العربة...")} />
        ) : cartError ? (
          <ErrorSection
            className="h-full"
            errorTitle={translate("Cart Error", "خطأ في العربة")}
            errorMessage={cartError}
            button={{ onClick: reFetch, text: translate("Retry", "إعادة المحاولة") }}
          />
        ) : cart.cartItems.length === 0 ? (
          emptyCartSection
        ) : (
          cart.cartItems.map((item, index) => <ProductInCart key={index} item={item} />)
        )}
      </div>
    </div>
  );
}
