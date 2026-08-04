import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import { Product, Variant } from "@/types/product";
import { isCustomer } from "@/utils/constants/roles";
import { notifyError } from "@/utils/helpers/notifiers";
import { solidIcons, outlineIcons } from "@/components/icons";
import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import paths from "@/utils/constants/paths";
import { getProductFinalPrice } from "@/utils/helpers/product-helpers";
import { trackEvent } from "@/utils/helpers/facebook-pixel";
import generateMongoId from "@/utils/helpers/generate-mongo-id";

export default function CartButton({
  product,
  variant,
  quantity = 1,
  buyNow = false,
  buttonSize = "lg",
}: {
  product?: Product;
  variant: Variant;
  quantity?: number;
  buyNow?: boolean;
  buttonSize?: "sm" | "md" | "lg";
}) {
  const { language, translate } = useLanguage();
  const { user } = useUser();
  const navigate = useNavigate();

  const { data: cart, setData: setCart } = useCart();

  const availableQuantity = variant.stock.reduce((acc, stock) => acc + stock.quantity, 0) || 0;

  const isVariantInCart = !!cart.cartItems.find((item) => item.variant._id === variant._id);

  function trackAddToCart() {
    if (product)
      trackEvent("AddToCart", {
        content_ids: [product._id],
        content_name: translate(product.title.en, product.title.ar),
        value: getProductFinalPrice(product.priceAfterDiscount, product.price),
        currency: "EGP",
      });
  }

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  function handleClick() {
    if (user && !isCustomer(user.role)) {
      notifyError({
        language,
        message: translate("Only customers can add products to their cart", "فقط العملاء يمكنهم إضافة المنتجات إلى السلة"),
      });
    } else if (isVariantInCart) {
      // If variant is already in cart, navigate to cart page
      navigate(`/${paths.cart}`);
    } else if (availableQuantity > 0) {
      handleRequest(language, setLoading, setError, async () => {
        if (user) {
          const res = await privateRequest({
            url: `cart`,
            method: "POST",
            data: { variantId: variant._id, quantity },
            language,
          });
          setCart(res.data);
        } else {
          const newCartItem = {
            _id: generateMongoId(),
            variant: { ...variant, productId: product! },
            quantity,
          };
          const newCart = {
            _id: cart._id,
            cartItems: [...cart.cartItems, newCartItem],
            discount: cart.discount,
            totalCartPrice:
              cart.totalCartPrice + getProductFinalPrice(product!.priceAfterDiscount, product!.price) * quantity,
            totalCartPriceAfterDiscount:
              cart.totalCartPriceAfterDiscount +
              getProductFinalPrice(product!.priceAfterDiscount, product!.price) * quantity,
          };
          setCart(newCart);
        }

        // Facebook Pixel tracking
        trackAddToCart();

        // If buyNow is true, navigate to checkout after adding to cart
        if (buyNow) navigate(`/${paths.checkout}`);
      });
    }
  }

  if (error) {
    notifyError({
      language,
      message: error,
      title: translate("Oops! Something went wrong", "عذرًا! حدث خطأ ما"),
    });

    setError("");
  }

  const fontWeight = buttonSize === "sm" ? 400 : 500;
  const fontSize = buttonSize === "sm" ? "0.8rem" : buttonSize === "md" ? "0.875rem" : "0.95rem";
  const iconSize = buttonSize === "sm" ? 18 : buttonSize === "md" ? 20 : 22;

  return (
    <Button
      onClick={handleClick}
      loading={loading}
      disabled={availableQuantity < 1}
      variant={buyNow ? "light" : "filled"}
      color="dark"
      size={buttonSize}
      loaderProps={{ type: "dots" }}
      style={{ fontWeight, fontSize }}
      leftSection={
        buyNow ? null : isVariantInCart ? (
          <solidIcons.Check size={iconSize} />
        ) : (
          <outlineIcons.ShoppingCart size={iconSize} />
        )
      }
    >
      {buyNow
        ? translate("Buy Now", "اشتري الآن")
        : isVariantInCart
          ? translate("In Your Cart", "فى سلتك")
          : translate("Add to Cart", "أضف إلى السلة")}
    </Button>
  );
}
