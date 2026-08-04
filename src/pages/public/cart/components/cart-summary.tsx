import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import paths from "@/utils/constants/paths";
import { Button, Skeleton } from "@mantine/core";
import CouponForm from "./coupon-form";

export default function CartSummary() {
  const { translations, translate } = useLanguage();
  const { data: cart, loading: isCartLoading } = useCart();

  const navigate = useNavigate();

  const [isAddingCoupon, setIsAddingCoupon] = useState(false);

  const hasDiscount = !!cart.discount;

  return (
    <>
      <h2 className="mb-2" style={{ fontWeight: 500 }}>
        {translate("Cart Summary", "ملخص العربة")}
      </h2>

      <div className="flex flex-col gap-3 rounded-lg border p-4">
        <div className="flex justify-between">
          <span>{translate("Subtotal", "المجموع الفرعي")}</span>
          {isCartLoading ? (
            <Skeleton width={100} height={20} />
          ) : (
            <span className={hasDiscount ? "line-through" : ""}>
              {cart.totalCartPrice.toFixed(2) || "0.00"}
              <span className="text-gray-800"> {translations.currency}</span>
            </span>
          )}
        </div>
        {hasDiscount ? (
          <div className="flex justify-between">
            <span>{translate("After Discount", "بعد الخصم")}</span>
            {isCartLoading ? (
              <Skeleton width={100} height={20} />
            ) : (
              <span>
                {cart.totalCartPriceAfterDiscount?.toFixed(2) || "0.00"}
                <span className="text-gray-800"> {translations.currency}</span>
              </span>
            )}
          </div>
        ) : null}

        <hr />

        <div className="flex justify-between">
          <b className="text-gray-800">{translate("Total", "مجموع")}</b>
          {isCartLoading ? (
            <Skeleton width={100} height={20} />
          ) : (
            <b className="text-gray-800">
              {(cart.totalCartPriceAfterDiscount || cart.totalCartPrice)?.toFixed(2) || "0.00"}
              <span className="text-gray-800"> {translations.currency}</span>
            </b>
          )}
        </div>

        <Button
          fullWidth
          size="lg"
          radius={"md"}
          disabled={!cart.cartItems.length}
          onClick={() => navigate(`/${paths.checkout}`)}
        >
          {translate("Proceed to Checkout", "المتابعة الى الدفع")}
        </Button>
      </div>

      {/* Coupons */}
      {cart.cartItems.length > 0 ? (
        <div className="mt-3">
          {isAddingCoupon ? (
            <CouponForm setIsAddingCoupon={setIsAddingCoupon} />
          ) : (
            <div className="animate-fade-in">
              <Button fullWidth variant="light" radius={"md"} p={0} onClick={() => setIsAddingCoupon(true)}>
                <span className="text-sm" style={{ fontWeight: 500 }}>
                  {translate("Have a coupon?", "لديك كوبون خصم؟")}
                </span>
              </Button>
            </div>
          )}
        </div>
      ) : null}

      {/* Features Box: Encourage purchase */}
      <FeaturesBox />
    </>
  );
}

// =============================================================

import { FiTruck } from "react-icons/fi";

function FeaturesBox() {
  const { translate } = useLanguage();

  return (
    <section
      className={`mt-4 w-full rounded-xl border border-gray-200 ${translate("bg-gradient-to-r", "bg-gradient-to-l")} from-green-50 to-white p-5`}
    >
      <div className="flex items-center justify-center gap-6 text-center">
        <div className="flex-center h-14 w-14 rounded-full bg-green-100 text-green-600">
          <FiTruck size={24} />
        </div>

        <div className="flex flex-col gap-1">
          <h4 className="text-start font-bold text-gray-800">
            {translate("Cash on Delivery & Fast Shipping", "الدفع عند الاستلام + شحن سريع")}
          </h4>

          <p className="text-start text-sm font-medium">
            {translate("Receive in 3-5 days and pay safely at your door.", "استلم خلال 3-5 أيام وادفع بأمان عند باب منزلك.")}
          </p>
        </div>
      </div>
    </section>
  );
}
