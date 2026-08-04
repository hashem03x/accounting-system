import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import apiRequest from "@/utils/helpers/api-request";
import { logError } from "@/utils/helpers/loggers";
import { forgetUser } from "@/utils/helpers/local-storage";
import { emptyCart } from "@/utils/helpers/cart-helpers";

export default function useLogout() {
  const { setUser } = useUser();
  const { language } = useLanguage();
  const { setData: setCart } = useCart();

  const logout = async () => {
    try {
      setUser(null);
      setCart(emptyCart);
      forgetUser();
      localStorage.setItem("wishlist", "[]");
      await apiRequest({ method: "GET", url: "auth/logout", credentials: "include", language });
    } catch (error) {
      logError("logout", error);
      throw error;
    }
  };

  return logout;
}
