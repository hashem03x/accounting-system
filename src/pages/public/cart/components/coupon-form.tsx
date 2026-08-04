import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import { Alert, Button, TextInput } from "@mantine/core";
import { solidIcons } from "@/components/icons";
import { useUser } from "@/context/UserContext";

export default function CouponForm({ setIsAddingCoupon }: { setIsAddingCoupon: (value: boolean) => void }) {
  const { language, translations, translate } = useLanguage();

  const { setData: setCart } = useCart();

  const { user } = useUser();

  const [coupon, setCoupon] = useState("");

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  const [success, setSuccess] = useState(false);

  async function handleAddCoupon(e: React.FormEvent) {
    e.preventDefault();

    // A special case for guest users
    if (!user) return setError(translate("Please login to apply a coupon.", "يرجى تسجيل الدخول لتطبيق كوبون."));

    handleRequest(language, setLoading, setError, async () => {
      const res = await privateRequest({ url: "cart/coupon", method: "PUT", data: { coupon } });
      setCart(res.data);
      setSuccess(true);
      setTimeout(() => setIsAddingCoupon(false), 5000);
    });
  }
  return success ? (
    <div className="animate-fade-in">
      <Alert color="green" icon={<solidIcons.CheckCircle />}>
        {translate("Awesome! Coupon accepted, enjoy the discount.", "ممتاز! تم قبول الكوبون، استمتع بالخصم.")}
      </Alert>
    </div>
  ) : (
    <form className="flex animate-fade-in flex-col gap-2" onSubmit={handleAddCoupon}>
      <div className="flex gap-2">
        <div className="flex-1">
          <TextInput
            placeholder={translate("Enter your coupon code", "ادخل كود الكوبون")}
            value={coupon}
            onChange={(e) => setCoupon(e.currentTarget.value)}
          />
        </div>
        <Button type="submit" loading={loading}>
          {translate("Apply", "تطبيق")}
        </Button>
        <Button variant="light" color="dark" onClick={() => setIsAddingCoupon(false)}>
          {translations.cancel}
        </Button>
      </div>
      {error && (
        <Alert color="red" icon={<solidIcons.ExclamationCircle />}>
          {error}
        </Alert>
      )}
    </form>
  );
}
