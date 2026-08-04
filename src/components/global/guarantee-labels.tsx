import { useLanguage } from "@/context/LanguageContext";
import { outlineIcons, solidIcons } from "@/components/icons";

const items = [
  {
    icon: <solidIcons.Clothes className="mb-3 text-4xl text-indigo-600" />,
    title: {
      ar: "تصاميم حصرية",
      en: "Exclusive Designs",
    },
    description: {
      ar: "قطع فريدة تجمع بين الأناقة والتميّز، لتُعبّر عن ذوقك الرفيع.",
      en: "Unique pieces that blend elegance and distinction to reflect your refined style.",
    },
  },
  {
    icon: <solidIcons.RolledCloth className="mb-3 text-4xl text-teal-600" />,
    title: {
      ar: "خامات فاخرة",
      en: "Premium Fabrics",
    },
    description: {
      ar: "نختار أفضل الأقمشة لضمان راحة تدوم ومظهر يلفت الأنظار.",
      en: "We select the finest fabrics to ensure lasting comfort and an eye-catching look.",
    },
  },
  {
    icon: <solidIcons.Money className="mb-3 text-4xl text-green-600" />,
    title: {
      ar: "الدفع عند الاستلام",
      en: "Cash on Delivery",
    },
    description: {
      ar: "اطمئن واستلم طلبك أولاً، ثم ادفع بكل راحة وأمان.",
      en: "Receive your order first, then pay comfortably and safely.",
    },
  },
  {
    icon: <outlineIcons.Shipping className="mb-3 text-4xl text-rose-600" />,
    title: {
      ar: "شحن سريع",
      en: "Fast Shipping",
    },
    description: {
      ar: "توصيل سريع من 3-5 أيام إلى باب منزلك مع ضمان سلامة المنتج.",
      en: "Fast delivery in 3-5 days to your door with guaranteed product safety.",
    },
  },
  {
    icon: <solidIcons.ArrowPath className="mb-3 text-4xl text-yellow-600" />,
    title: {
      ar: "ضمان الاسترجاع",
      en: "Return Guarantee",
    },
    description: {
      ar: "استبدال أو استرجاع خلال 14 يومًا مع ضمان كامل ضد عيوب الصناعة.",
      en: "Exchange or return within 14 days with full guarantee against manufacturing defects.",
    },
  },
];

export default function GuaranteeLabels() {
  const { translate } = useLanguage();

  return (
    <div className="flex w-full flex-col items-stretch justify-between gap-4 border-y border-gray-200 bg-white p-4 text-right shadow-sm md:flex-row md:p-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex-1 cursor-default rounded-lg p-4 text-gray-800 transition-shadow duration-300 hover:bg-gray-50"
        >
          <div className="flex flex-col items-center">
            {item.icon}
            <h4 className="mb-1 text-center text-base font-bold">{translate(item.title.en, item.title.ar)}</h4>
            <p className="max-w-[250px] text-center text-sm leading-relaxed text-gray-600">
              {translate(item.description.en, item.description.ar)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
