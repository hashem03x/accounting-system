import { useLanguage } from "@/context/LanguageContext";
import { Product } from "@/types/product";

export default function ProductPrice({ product, vertical = false }: { product: Product; vertical?: boolean }) {
  const { translations } = useLanguage();
  const hasDiscount = product.priceAfterDiscount && product.priceAfterDiscount !== product.price;

  return (
    <span className="flex gap-1" style={{ fontWeight: "500" }}>
      {hasDiscount ? (
        <span className={`flex flex-wrap ${vertical ? "flex-col" : "flex-row items-center gap-2"}`}>
          <span className={`text-nowrap text-lg text-gray-800 sm:text-xl`}>
            {product.priceAfterDiscount?.toFixed(2)}{" "}
            <span className="text-xs text-gray-600 sm:text-sm">{translations.currency}</span>
          </span>
          <span className={`text-nowrap text-xs leading-3 text-gray-800 line-through sm:text-sm`}>
            {product.price.toFixed(2)} {translations.currency}
          </span>
        </span>
      ) : (
        <span className={`text-nowrap text-lg text-gray-800 sm:text-xl`}>
          {product.price.toFixed(2)} <span className="text-xs text-gray-600 sm:text-sm">{translations.currency}</span>
        </span>
      )}
    </span>
  );
}
