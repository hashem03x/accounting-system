import { useLanguage } from "@/context/LanguageContext";
import { CartItem } from "@/types/cart";
import { useNavigate } from "react-router-dom";
import { getProductFinalPrice } from "@/utils/helpers/product-helpers";
import { getColorLabel } from "@/utils/constants/colors";
import paths from "@/utils/constants/paths";
import ratios from "@/utils/constants/ratios";
import Img from "@/components/ui/img";
import placeholderImage from "@/assets/placeholder.jpg";

export default function ProductItem({ item }: { item: CartItem }) {
  const { language, translate, translations } = useLanguage();

  const navigate = useNavigate();

  const product = item.variant.productId;

  const productColorObject = product.colors.find((color) => color.name === item.variant.color);
  const image = productColorObject?.images[0]?.url || placeholderImage;
  const colorCode = productColorObject?.code || "#000";

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="w-[100px] overflow-hidden rounded">
        <div
          className="cursor-pointer hover:opacity-85"
          onClick={() => navigate(`/${paths.products}/${product._id}?color=${item.variant.color}`)}
        >
          <Img width="100%" aspectRatio={ratios.product} src={image} alt={translate(product.title.en, product.title.ar)} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 sm:gap-3">
        {/* Product Name and Price */}
        <header className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-sm font-medium sm:text-base">
            <span
              className="cursor-pointer text-gray-800"
              onClick={() => navigate(`/${paths.products}/${product._id}?color=${item.variant.color}`)}
            >
              {translate(product.title.en, product.title.ar)}
            </span>
          </h4>
          <div className="flex items-center gap-1">
            <p className="text-gray-800" style={{ fontWeight: 600 }}>
              {getProductFinalPrice(product.priceAfterDiscount, product.price).toFixed(2)} {translations.currency}
            </p>
            <sub className="text-gray-500"> * {item.quantity}</sub>
          </div>
        </header>

        {/* Size and Color and Quantity */}
        <div className="flex flex-col gap-2">
          <span className="text-sm text-gray-800">
            {translate("Size", "المقاس")}: {item.variant.size}
          </span>
          <span className="flex items-center gap-2 text-sm text-gray-800">
            <span>{translate("Color", "اللون")}</span>
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: colorCode }}></span>
            <span className="text-gray-800">{getColorLabel(item.variant.color, language)}</span>
          </span>
          <span className="text-sm text-gray-800">
            {translate("Quantity", "الكمية")}: {item.quantity}
          </span>
        </div>
      </div>
    </div>
  );
}
