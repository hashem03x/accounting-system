import { useLanguage } from "@/context/LanguageContext";
import { WebsitePaymentMethod } from "@/types/payment";
import { LocalizedLabel } from "@/types/global";
import { solidIcons, outlineIcons } from "@/components/icons";

import cardImg from "@/assets/credit-card.png";
import walletImg from "@/assets/wallet.png";
import codImg from "@/assets/cod.png";

const paymentMethodDetails: Record<WebsitePaymentMethod, { subtitle: { en: string; ar: string }; image: string }> = {
  cod: {
    subtitle: { en: "Pay when you receive your order", ar: "ادفع عند استلام طلبك" },
    image: codImg,
  },
  card: {
    subtitle: { en: "Secure payment via Paymob", ar: "دفع آمن عبر بايموب" },
    image: cardImg,
  },
  wallet: {
    subtitle: { en: "Vodafone Cash, Etisalat Cash, etc.", ar: "فودافون كاش، اتصالات كاش، وغيرها" },
    image: walletImg,
  },
};

export default function PaymentMethodOption({
  paymentMethod,
  selectedPaymentMethod,
  onClick,
  disabled = false,
}: {
  paymentMethod: LocalizedLabel<WebsitePaymentMethod>;
  selectedPaymentMethod: WebsitePaymentMethod;
  onClick: () => void;
  disabled?: boolean;
}) {
  const { translate } = useLanguage();

  const isSelected = selectedPaymentMethod === paymentMethod.value;
  const details = paymentMethodDetails[paymentMethod.value];

  return (
    <div
      className={`flex cursor-pointer items-center justify-between rounded-xl border-[1.8px] px-6 py-4 transition ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : isSelected
            ? "border-blue-400 bg-blue-50"
            : "hover:border-blue-400 hover:bg-blue-50/50"
      }`}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="flex items-center gap-4">
        <div>
          {isSelected ? (
            <solidIcons.CheckCircle className="text-blue-500" size={21} />
          ) : (
            <outlineIcons.Circle className="text-gray-300" size={21} />
          )}
        </div>

        <div className="flex flex-col">
          <span className="font-bold text-gray-800">{translate(paymentMethod.label.en, paymentMethod.label.ar)}</span>
          <span className="text-xs text-gray-600 sm:text-sm">{translate(details.subtitle.en, details.subtitle.ar)}</span>
        </div>
      </div>

      <img
        src={details.image}
        alt={translate(paymentMethod.label.en, paymentMethod.label.ar)}
        className="h-10 w-10 object-contain"
      />
    </div>
  );
}
