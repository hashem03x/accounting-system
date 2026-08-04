import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import useCategoryHelpers from "@/hooks/useCategoryHelpers";
import useWarehouseHelpers from "@/hooks/useWarehouseHelpers";
import { Product, Color, Variant, ProductColor } from "@/types/product";
import { getColorLabel } from "@/utils/constants/colors";
import { isAdmin } from "@/utils/constants/roles";
import { solidIcons } from "@/components/icons";
import ProductPrice from "@/components/global/product-price";
import AdminView from "./components/admin-view";
import ProductBreadcrumbs from "./components/breadcrumbs";
import ImageGallery from "./components/image-gallery";
import Share from "./components/share";
import CartButton from "./components/cart-button";
import WishlistButton from "@/components/global/wishlist-button";
import GuaranteeLabels from "@/components/global/guarantee-labels";
import { Rating } from "@mantine/core";
import { Review } from "@/types/review";
import { useDisclosure } from "@mantine/hooks";
import ReviewModal from "./components/review-modal";

// IMPORTANT:
// Product colors and variant should be filtered (using filterProduct helper) before passing the product to this component

const STICKY_BAR_HEIGHT = 65;
const HEADER_HEIGHT = 80; // DON'T CHANGE THIS VALUE, IT'S FROM THE BASE LAYOUT

export default function ProductLayout({
  product,
  setProduct,
  userReview,
  setUserReview,
  userHasBoughtThis,
}: {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  userReview: Review | null;
  setUserReview: React.Dispatch<React.SetStateAction<Review | null>>;
  userHasBoughtThis: boolean;
}) {
  const { translate } = useLanguage();
  const { user } = useUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const { getSubcategoryNameById } = useCategoryHelpers();

  const colorOptions = product.colors;

  const selectedColor: ProductColor = colorOptions.find((c) => c.name === searchParams.get("color")) || colorOptions[0];

  function setSelectedColor(color: Color) {
    searchParams.set("color", color);
    setSearchParams(searchParams);
  }

  const variantOptions = product.variants.filter((v) => v.color === selectedColor.name);

  const [selectedVariant, setSelectedVariant] = useState<Variant>(variantOptions[0]);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  useEffect(() => {
    // On color change, if the selected variant is not available in the new color, select the first available variant
    if (!variantOptions.some((v) => v.size === selectedVariant.size)) {
      setSelectedVariant(variantOptions[0]);
    } else {
      // Update to the variant with the same size but new color
      const newVariant = variantOptions.find((v) => v.size === selectedVariant.size);
      if (newVariant) {
        setSelectedVariant(newVariant);
      }
    }
  }, [selectedColor, selectedVariant.size, variantOptions]);

  useEffect(() => {
    // Reset quantity to 1 when variant changes
    setSelectedQuantity(1);
  }, [selectedVariant]);

  const discountPercentage = product.priceAfterDiscount
    ? ((product.price - product.priceAfterDiscount) / product.price) * 100
    : 0;

  const [reviewModalOpened, { open: openReviewModal, close: closeReviewModal }] = useDisclosure(false);

  return (
    <div className="flex flex-col gap-6" style={{ paddingTop: `${STICKY_BAR_HEIGHT}px` }}>
      <StickyBar
        product={product}
        selectedQuantity={selectedQuantity}
        setSelectedQuantity={setSelectedQuantity}
        selectedVariant={selectedVariant}
        variantOptions={variantOptions}
      />

      {/* Admin View */}
      {product && user && isAdmin(user.role) && <AdminView product={product} />}

      <ProductBreadcrumbs product={product} />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <ImageGallery images={selectedColor.images} discountPercentage={discountPercentage} />
        </div>

        {/* Product Details */}
        <div className="flex flex-col gap-4">
          {/* Title, Subcategory and Share */}
          <header className="flex flex-wrap justify-between gap-2">
            <div className="flex flex-col gap-2">
              <h2>{translate(product.title.en, product.title.ar)}</h2>
              <div className="flex items-center gap-2">
                <Rating value={product.ratingsAverage || 0} fractions={2} readOnly size="sm" />
                {product.ratingsQuantity ? (
                  <span className="text-xs text-gray-500 sm:text-sm">
                    {product.ratingsQuantity} {translate("Reviews", "تقييمات")}
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 sm:text-sm">{translate("No Reviews", "لا توجد تقييمات")}</span>
                )}
                {user && userHasBoughtThis && (
                  <>
                    <button onClick={openReviewModal} className="text-xs text-orange-500 hover:underline">
                      {translate(
                        `${userReview ? "Update" : "Add"} Rating`,
                        `${userReview ? "تحديث التقييم" : "إضافة تقييم"}`,
                      )}
                    </button>
                    <ReviewModal
                      opened={reviewModalOpened}
                      close={closeReviewModal}
                      product={product}
                      setProduct={setProduct}
                      review={userReview}
                      setReview={setUserReview}
                    />
                  </>
                )}
              </div>
              <p>
                {translate("Category", "الفئة")}: {getSubcategoryNameById(product.subcategory)}
              </p>
            </div>
            <Share />
          </header>

          {/* Price */}
          <ProductPrice product={product} vertical />

          {/* Description */}
          <div>
            <b className="text-sm text-gray-800 sm:text-base">{translate("Description", "الوصف")}</b>
            <p>{translate(product.description.en, product.description.ar)}</p>
          </div>

          <hr className="opacity-50" />

          {/* Color Selection */}
          <ColorSelector colors={colorOptions} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

          <hr className="opacity-50" />

          {/* Variant (Size) Selection */}
          <VariantSelector
            variants={variantOptions}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />

          <hr className="opacity-50" />

          {/* Quantity Selection */}
          <QuantitySelector
            selectedQuantity={selectedQuantity}
            setSelectedQuantity={setSelectedQuantity}
            availableQuantity={
              variantOptions
                .find((v) => v._id === selectedVariant?._id)
                ?.stock.reduce((acc, stock) => acc + stock.quantity, 0) || 0
            }
          />

          <hr className="opacity-50" />

          {/* Options */}
          <div className="flex flex-wrap gap-3">
            <CartButton product={product} variant={selectedVariant} quantity={selectedQuantity} />
            <WishlistButton product={product} />
            <OrderViaWhatsAppButton product={product} variant={selectedVariant} quantity={selectedQuantity} />
          </div>

          <hr className="opacity-50" />

          {/* Warehouse Availability */}
          <WarehouseAvailability variant={selectedVariant} />
        </div>
      </div>

      <div className="mt-8">
        <GuaranteeLabels />
      </div>
    </div>
  );
}

// =============================================================

function StickyBar({
  product,
  selectedQuantity,
  setSelectedQuantity,
  selectedVariant,
  variantOptions,
}: {
  product: Product;
  selectedQuantity: number;
  setSelectedQuantity: React.Dispatch<React.SetStateAction<number>>;
  selectedVariant: Variant;
  variantOptions: Variant[];
}) {
  return (
    <div
      className="fixed left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-md"
      style={{ height: `${STICKY_BAR_HEIGHT}px`, top: `${HEADER_HEIGHT}px` }}
    >
      <div className="container flex h-full items-center justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          {/* Quantity Selector - Compact */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => selectedQuantity > 1 && setSelectedQuantity(selectedQuantity - 1)}
              disabled={selectedQuantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <solidIcons.Minus size={14} className="text-gray-800" />
            </button>
            <div className="flex-center h-8 w-10 rounded border border-gray-300 text-center text-sm font-bold text-gray-800">
              {selectedQuantity}
            </div>
            <button
              onClick={() => {
                const availableQuantity =
                  variantOptions
                    .find((v) => v._id === selectedVariant?._id)
                    ?.stock.reduce((acc, stock) => acc + stock.quantity, 0) || 0;
                if (selectedQuantity < availableQuantity) {
                  setSelectedQuantity(selectedQuantity + 1);
                }
              }}
              disabled={
                selectedQuantity >=
                (variantOptions
                  .find((v) => v._id === selectedVariant?._id)
                  ?.stock.reduce((acc, stock) => acc + stock.quantity, 0) || 0)
              }
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <solidIcons.Plus size={14} className="text-gray-800" />
            </button>
          </div>
        </div>

        {/* Cart Button - Wishlist Button */}
        <div className="flex items-center gap-2">
          <CartButton product={product} variant={selectedVariant} quantity={selectedQuantity} buttonSize="sm" />
          <CartButton product={product} variant={selectedVariant} quantity={selectedQuantity} buttonSize="sm" buyNow />
        </div>
      </div>
    </div>
  );
}

// =============================================================

function ColorSelector({
  colors,
  selectedColor,
  setSelectedColor,
}: {
  colors: ProductColor[];
  selectedColor: ProductColor;
  setSelectedColor: (color: Color) => void;
}) {
  const { translate, language } = useLanguage();

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">{translate("Choose Color", "اختر اللون")}</h2>
      <div className="flex gap-2.5">
        {colors.map((color) => (
          <button
            key={color.name}
            onClick={() => setSelectedColor(color.name)}
            className={`h-9 w-9 rounded-full border transition-colors ${selectedColor.name === color.name ? "border-gray-600" : "border-gray-100"}`}
            style={{ backgroundColor: color.code }}
            title={getColorLabel(color.name, language)}
          >
            {selectedColor.name === color.name && <solidIcons.Check className="m-auto text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}

// =============================================================

function VariantSelector({
  variants,
  selectedVariant,
  setSelectedVariant,
}: {
  variants: Variant[];
  selectedVariant: Variant;
  setSelectedVariant: React.Dispatch<React.SetStateAction<Variant>>;
}) {
  const { translate } = useLanguage();

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">{translate("Choose Size", "اختر المقاس")}</h2>
      <div className="flex gap-2.5">
        {variants.length === 0 ? (
          <p>{translate("No sizes available", "لا توجد مقاسات متاحة")}</p>
        ) : (
          variants.map((variant) => (
            <button
              key={variant._id}
              onClick={() => setSelectedVariant(variant)}
              className={`rounded border px-5 py-3 transition-colors ${selectedVariant.size === variant.size ? "border-gray-500 bg-gray-200" : "border-gray-200"}`}
            >
              {variant.size}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// =============================================================

function QuantitySelector({
  selectedQuantity,
  setSelectedQuantity,
  availableQuantity,
}: {
  selectedQuantity: number;
  setSelectedQuantity: React.Dispatch<React.SetStateAction<number>>;
  availableQuantity: number;
}) {
  const { translate } = useLanguage();

  const handleDecrease = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(selectedQuantity - 1);
    }
  };

  const handleIncrease = () => {
    if (selectedQuantity < availableQuantity) {
      setSelectedQuantity(selectedQuantity + 1);
    }
  };

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(e.target.value);
  //   if (!isNaN(value) && value >= 1 && value <= availableQuantity) {
  //     setSelectedQuantity(value);
  //   }
  // };

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">{translate("Quantity", "الكمية")}</h2>
      <div className="flex items-center gap-2">
        <button
          onClick={handleDecrease}
          disabled={selectedQuantity <= 1}
          className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <solidIcons.Minus className="text-gray-800" />
        </button>
        <div className="flex-center h-10 w-16 rounded border border-gray-300 text-center font-bold text-gray-800">
          {selectedQuantity}
        </div>
        <button
          onClick={handleIncrease}
          disabled={selectedQuantity >= availableQuantity}
          className="flex h-10 w-10 items-center justify-center rounded border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <solidIcons.Plus className="text-gray-800" />
        </button>
      </div>
    </div>
  );
}

// =============================================================

function WarehouseAvailability({ variant }: { variant: Variant }) {
  const { translate } = useLanguage();
  const { getWarehouseNameById } = useWarehouseHelpers();

  const availableWarehouses = variant.stock.filter((s) => s.quantity > 0);

  if (availableWarehouses.length === 0) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <h2 className="mb-2 text-lg font-semibold text-red-800">{translate("Store Availability", "التوفر في الفروع")}</h2>
        <p className="text-sm text-red-600">
          {translate("Currently out of stock in all stores", "غير متوفر حالياً في جميع الفروع")}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-blue-50 p-4">
      <h3 className="mb-2 text-base font-semibold text-blue-800">{translate("Store Availability", "التوفر في الفروع")}</h3>
      <p className="mb-2 text-sm text-gray-600">
        {translate(
          "You can also visit any of our stores below to purchase this item:",
          "يمكنك أيضاً زيارة أي من فروعنا التالية لشراء هذا المنتج:",
        )}
      </p>
      <div className="flex flex-col gap-2">
        {availableWarehouses.map((stock) => (
          <div key={stock.warehouse} className="flex items-center gap-2 text-sm">
            <span className="text-blue-600">🏠</span>
            <span className="font-medium text-gray-800">{getWarehouseNameById(stock.warehouse)}</span>
            {/* <span className="text-gray-500">
              ({stock.quantity} {translate("in stock", "متوفر")})
            </span> */}
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================

type OrderViaWhatsAppButtonProps = {
  product: Product;
  variant: Variant;
  quantity: number;
};

function OrderViaWhatsAppButton({ product, variant, quantity }: OrderViaWhatsAppButtonProps) {
  const { translate, language } = useLanguage();
  // const phone = "+201128695145";
  const phone = "+201011105252";
  const productLink = typeof window !== "undefined" ? window.location.href : "";
  const message = encodeURIComponent(
    `${translate(
      "Dear Sales Team,\nI would like to place an order for the item below and kindly request your assistance with the purchase details.\n",
      "السادة فريق المبيعات،\nأرغب في طلب المنتج الموضح أدناه، وأرجو تفضلكم بتزويدي بتفاصيل الشراء.\n",
    )}\n` +
      `${translate("Product Name", "اسم المنتج")}: ${translate(product.title.en, product.title.ar)}\n` +
      `${translate("Variant Code", "كود الصنف")}: ${variant.variantCode}\n` +
      `${translate("Color", "اللون")}: ${getColorLabel(variant.color, language)}\n` +
      `${translate("Size", "المقاس")}: ${variant.size}\n` +
      `${translate("Quantity", "الكمية")}: ${quantity}\n` +
      `\n${translate("Product Link", "رابط المنتج")}: ${productLink}`,
  );
  const url = `https://wa.me/${phone}?text=${message}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 rounded bg-green-500 px-5 py-3 text-white transition-colors hover:bg-green-600 focus:outline-none"
      style={{ minWidth: 180, justifyContent: "center" }}
    >
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.52 3.48A11.87 11.87 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.17 1.6 5.98L0 24l6.19-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22c-1.77 0-3.5-.46-5.01-1.33l-.36-.21-3.68.96.98-3.59-.23-.37A9.94 9.94 0 0 1 2 12c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.34.42-.51.14-.17.18-.29.28-.48.09-.19.05-.36-.02-.5-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.62-.47-.16-.01-.36-.01-.56-.01-.19 0-.5.07-.76.34-.26.27-1 1-.99 2.43.01 1.43 1.03 2.81 1.18 3.01.15.2 2.03 3.1 5.01 4.22.7.24 1.25.38 1.68.49.71.18 1.36.15 1.87.09.57-.07 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33z" />
      </svg>
      {translate("Order Via WhatsApp", "اطلب عبر واتساب")}
    </a>
  );
}
