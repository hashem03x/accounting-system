import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import useFetchingStatus from "@/hooks/useFetchingStatus";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import handleRequest from "@/utils/helpers/handle-request";
import { CartItem } from "@/types/cart";
import { getProductFinalPrice } from "@/utils/helpers/product-helpers";
import { notifyError } from "@/utils/helpers/notifiers";
import paths from "@/utils/constants/paths";
import ratios from "@/utils/constants/ratios";
import Img from "@/components/ui/img";
import { Button } from "@mantine/core";
import { outlineIcons } from "@/components/icons";
import placeholderImage from "@/assets/placeholder.jpg";
import { getColorLabel } from "@/utils/constants/colors";

export default function ProductInCart({ item }: { item: CartItem }) {
  const { language, translate, translations } = useLanguage();

  const { user } = useUser();

  const { data: cart, setData: setCart } = useCart();

  const navigate = useNavigate();

  const product = item.variant.productId;

  const privateRequest = usePrivateRequest();

  const { loading: updating, setLoading: setUpdating, error: updateError, setError: setUpdateError } = useFetchingStatus();

  const { loading: deleting, setLoading: setDeleting, error: deleteError, setError: setDeleteError } = useFetchingStatus();

  const productColorObject = product.colors.find((color) => color.name === item.variant.color);
  const image = productColorObject?.images[0]?.url || placeholderImage;
  const colorCode = productColorObject?.code || "#000";

  async function updateItem(quantity: number, type: "increment" | "decrement") {
    if (quantity < 1 || quantity > 10) return;
    if (!product) return;
    if (quantity > item.variant.stock.reduce((acc, stock) => acc + stock.quantity, 0)) {
      notifyError({
        language,
        message: translate("Sorry, the quantity you requested is not available", "عذرًا، الكمية التي طلبتها غير متوفرة"),
      });
      return;
    }

    handleRequest(language, setUpdating, setUpdateError, async () => {
      if (user) {
        const res = await privateRequest({ url: `cart/${item.variant._id}`, method: "PUT", data: { quantity }, language });
        setCart(res.data);
      } else {
        const newCartItem = { ...item, quantity };
        const newCart = {
          _id: cart._id,
          cartItems: cart.cartItems.map((cartItem) => (cartItem._id === item._id ? newCartItem : cartItem)),
          discount: cart.discount,
          totalCartPrice:
            cart.totalCartPrice +
            (type === "increment"
              ? getProductFinalPrice(product.priceAfterDiscount, product.price)
              : -getProductFinalPrice(product.priceAfterDiscount, product.price)),
          totalCartPriceAfterDiscount:
            cart.totalCartPriceAfterDiscount +
            (type === "increment"
              ? getProductFinalPrice(product.priceAfterDiscount, product.price)
              : -getProductFinalPrice(product.priceAfterDiscount, product.price)),
        };
        setCart(newCart);
      }
    });
  }

  function deleteItem() {
    handleRequest(language, setDeleting, setDeleteError, async () => {
      if (user) {
        const res = await privateRequest({ url: `cart/${item._id}`, method: "DELETE", language });
        setCart(res.data);
      } else {
        const newCart = {
          _id: cart._id,
          cartItems: cart.cartItems.filter((cartItem) => cartItem._id !== item._id),
          discount: cart.discount,
          totalCartPrice:
            cart.totalCartPrice - getProductFinalPrice(product.priceAfterDiscount, product.price) * item.quantity,
          totalCartPriceAfterDiscount:
            cart.totalCartPriceAfterDiscount -
            getProductFinalPrice(product.priceAfterDiscount, product.price) * item.quantity,
        };
        setCart(newCart);
      }
    });
  }

  if (updateError) {
    notifyError({
      language,
      title: translate("An error occurred while updating the product", "حدث خطأ أثناء تحديث المنتج"),
      message: updateError,
    });

    setUpdateError("");
  }

  if (deleteError) {
    notifyError({
      language,
      title: translate("An error occurred while deleting the product", "حدث خطأ أثناء حذف المنتج"),
      message: deleteError,
    });

    setDeleteError("");
  }

  return (
    <div className="flex gap-3 sm:gap-4">
      <div className="w-[125px] overflow-hidden rounded">
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
              className="cursor-pointer"
              onClick={() => navigate(`/${paths.products}/${product._id}?color=${item.variant.color}`)}
            >
              {translate(product.title.en, product.title.ar)}
            </span>
          </h4>
          <p className="text-gray-800" style={{ fontWeight: 600 }}>
            {getProductFinalPrice(product.priceAfterDiscount, product.price).toFixed(2)} {translations.currency}
          </p>
        </header>

        {/* Size and Color */}
        <div className="flex flex-col gap-2 text-sm">
          <span>
            {translate("Size", "المقاس")}: {item.variant.size}
          </span>
          <span className="flex items-center gap-2">
            <span>{translate("Color", "اللون")}</span>
            <span className="h-4 w-4 rounded-full" style={{ backgroundColor: colorCode }} />
            <span className="text-gray-800">{getColorLabel(item.variant.color, language)}</span>
          </span>
        </div>

        {/* Quantity and Delete */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Quantity */}
          <div className="flex w-28 items-center justify-between gap-2 rounded-full border p-1 sm:w-32">
            <QuantityChangerButton
              onClick={() => updateItem(item.quantity - 1, "decrement")}
              disabled={deleting || item.quantity <= 1 || updating}
              loading={updating}
            >
              -
            </QuantityChangerButton>
            <b>{item.quantity}</b>
            <QuantityChangerButton
              onClick={() => updateItem(item.quantity + 1, "increment")}
              disabled={deleting || item.quantity >= 10 || updating}
              loading={updating}
            >
              +
            </QuantityChangerButton>
          </div>
          {/* Delete */}
          <Button variant="default" px={11} radius="lg" onClick={deleteItem} loading={deleting}>
            <outlineIcons.Trash />
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuantityChangerButton({
  onClick,
  disabled,
  children,
  loading,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  loading: boolean;
}) {
  return (
    <button
      className={`flex-center h-6 w-6 rounded-full bg-gray-50 font-bold text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed sm:h-8 sm:w-8 ${loading ? "opacity-50" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
