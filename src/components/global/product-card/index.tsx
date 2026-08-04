import { useState } from "react";
import { useHover } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { getColorLabel } from "@/utils/constants/colors";
import { Product } from "@/types/product";
import paths from "@/utils/constants/paths";
import ratios from "@/utils/constants/ratios";
import Img from "@/components/ui/img";
import WishlistButton from "@/components/global/wishlist-button";
import ProductPrice from "@/components/global/product-price";
import placeholderImage from "@/assets/placeholder.jpg";
import { solidIcons } from "@/components/icons";

export default function ProductCard({ product }: { product: Product }) {
  const { language, translate } = useLanguage();
  const navigate = useNavigate();
  const { hovered: cardHovered, ref: cardRef } = useHover();
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  const productImage = hoveredColor
    ? product.colors.find((color) => color.name === hoveredColor)?.images[0]?.url || placeholderImage
    : product.colors[0]?.images[0]?.url || placeholderImage;

  // Product availability filters the colors before rendering this component
  const isAnyColorAvailable: boolean = product.colors.length > 0;

  const discountPercentage = product.priceAfterDiscount
    ? ((product.price - product.priceAfterDiscount) / product.price) * 100
    : 0;

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col gap-2 overflow-hidden rounded transition-opacity hover:opacity-90 ${isAnyColorAvailable ? "cursor-pointer" : ""}`}
      onClick={
        isAnyColorAvailable ? () => navigate(`/${paths.products}/${product._id}?color=${product.colors[0].name}`) : undefined
      }
    >
      {/* Wishlist Button */}
      <div
        className={`absolute top-0 z-10 flex w-[50px] flex-col p-2 ${cardHovered ? "right-0" : "-right-20"} transition-all duration-300 ease-in-out`}
      >
        <WishlistButton product={product} mini={true} />
      </div>

      {discountPercentage > 0 ? (
        <div className="absolute left-3.5 top-5 z-10 rotate-[-10deg] rounded-md bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-md">
          {translate("Save", "وفر")} {discountPercentage < 10 ? discountPercentage.toFixed(2) : discountPercentage.toFixed()}
          %
        </div>
      ) : null}

      {/* Product Image */}
      <Img
        src={productImage}
        alt={translate(product.title.en, product.title.ar)}
        aspectRatio={ratios.product}
        width="100%"
      />

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-1 py-1">
        <div className="flex flex-1 flex-col gap-1">
          {isAnyColorAvailable && (
            <div className="flex cursor-default items-center justify-start gap-2 rounded-full border px-2 py-1.5">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  className="relative h-[18px] w-[18px] rounded-full border border-gray-400 transition-colors hover:border-gray-800"
                  style={{ backgroundColor: color.code }}
                  title={getColorLabel(color.name, language)}
                  onMouseEnter={() => setHoveredColor(color.name)}
                  onMouseLeave={() => setHoveredColor(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/${paths.products}/${product._id}?color=${color.name}`);
                  }}
                ></button>
              ))}
            </div>
          )}
          <h4 className="text-sm text-gray-950 sm:text-base" style={{ fontWeight: 400 }}>
            {translate(product.title.en, product.title.ar)}
          </h4>
          <ProductPrice product={product} />
        </div>
        <button className="flex items-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-200">
          <solidIcons.Plus className="h-5 w-5 text-gray-700" />
          {translate("Add to Cart", "أضف الى السلة")}
        </button>
      </div>
    </div>
  );
}
