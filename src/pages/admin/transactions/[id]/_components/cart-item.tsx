import { useLanguage } from "@/context/LanguageContext";
import paths from "@/utils/constants/paths";
import { getColorLabel } from "@/utils/constants/colors";
import { CartItem as CartItemType } from "@/types/cart";
import { Link } from "react-router-dom";

export default function CartItem({ item }: { item: CartItemType }) {
  const { language, translate } = useLanguage();

  const product = item.variant.productId;

  const productColorObject = product.colors.find((color) => color.name === item.variant.color);

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-sm">
      {/* Product Info */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-medium text-gray-800 sm:text-base">
          <Link to={`/${paths.products}/${product._id}`} className="transition-colors hover:text-gray-500">
            {translate(product.title.en, product.title.ar)}
          </Link>
        </div>
        <div className="flex items-center gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1">
            <span>{translate("Size", "المقاس")}:</span>
            <span className="font-medium">{item.variant.size}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{translate("Color", "اللون")}:</span>
            <span style={{ background: productColorObject?.code }} className="block h-4 w-4 rounded-full"></span>
            <span className="text-gray-800">{getColorLabel(item.variant.color, language)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{translate("Quantity", "الكمية")}:</span>
            <span className="font-medium">{item.quantity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
