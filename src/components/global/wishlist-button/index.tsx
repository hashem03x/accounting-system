import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import { Product } from "@/types/product";
import { notifyError } from "@/utils/helpers/notifiers";
import { isCustomer } from "@/utils/constants/roles";
import { Button, Tooltip } from "@mantine/core";
import { solidIcons, outlineIcons } from "@/components/icons";

export default function WishlistButton({ product, mini = false }: { product: Product; mini?: boolean }) {
  const { language, translate } = useLanguage();
  const { user, setUser } = useUser();

  const localWishlist = localStorage.getItem("wishlist");
  let parsedLocalWishlist = localWishlist ? JSON.parse(localWishlist) : [];

  const inWishlist = user?.wishlist.includes(product._id) || parsedLocalWishlist.includes(product._id);

  const { privateRequest, loading, setLoading, error, setError } = useDataHandler({ initialData: null });

  if (error) {
    notifyError({
      language,
      message: error,
      title: translate("Oops! Something went wrong", "عذرًا! حدث خطأ ما"),
    });

    setError("");
  }

  function handleClick() {
    if (user && !isCustomer(user.role)) {
      notifyError({
        language,
        message: translate(
          "Only customers can add products to wishlist",
          "يمكن للعملاء فقط إضافة المنتجات إلى قائمة المفضلة",
        ),
      });
    } else if (inWishlist) {
      handleRequest(language, setLoading, setError, async () => {
        if (user) {
          await privateRequest({
            method: "DELETE",
            url: `wishlist/${product._id}`,
            language,
          });
          setUser({ ...user, wishlist: user.wishlist.filter((id) => id !== product._id) });
        } else {
          parsedLocalWishlist = parsedLocalWishlist.filter((id: string) => id !== product._id);
          localStorage.setItem("wishlist", JSON.stringify(parsedLocalWishlist));
        }
      });
    } else if (!inWishlist) {
      handleRequest(language, setLoading, setError, async () => {
        if (user) {
          await privateRequest({
            method: "POST",
            url: `wishlist`,
            data: { productId: product._id },
            language,
          });
          setUser({ ...user, wishlist: [...user.wishlist, product._id] });
        } else {
          parsedLocalWishlist.push(product._id);
          localStorage.setItem("wishlist", JSON.stringify(parsedLocalWishlist));
        }
      });
    }
  }

  return mini ? (
    <Tooltip
      label={
        inWishlist ? translate("Remove from Wishlist", "إزالة من المفضلة") : translate("Add to Wishlist", "أضف إلى المفضلة")
      }
      position="left"
      withArrow
    >
      <Button
        px="0"
        variant="default"
        style={{ borderWidth: 0 }}
        loading={loading}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        {inWishlist ? <solidIcons.Check size={20} /> : <outlineIcons.Heart size={20} />}
      </Button>
    </Tooltip>
  ) : (
    <Button
      onClick={handleClick}
      loading={loading}
      color="dark"
      variant="light"
      size="lg"
      loaderProps={{ type: "dots" }}
      style={{ fontWeight: 500, minWidth: "175px", fontSize: "0.95rem" }}
      leftSection={inWishlist ? <solidIcons.Check size={20} /> : <outlineIcons.Heart size={20} />}
    >
      {inWishlist ? translate("Remove from Wishlist", "إزالة من المفضلة") : translate("Add to Wishlist", "أضف إلى المفضلة")}
    </Button>
  );
}
