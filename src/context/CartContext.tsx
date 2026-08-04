import { Cart, CartContextProps } from "@/types/cart";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import useDataHandler from "@/hooks/useDataHandler";
import handleRequest from "@/utils/helpers/handle-request";
import { emptyCart } from "@/utils/helpers/cart-helpers";
import { isCustomer } from "@/utils/constants/roles";

export const CartContext = createContext<CartContextProps>({
  data: emptyCart,
  setData: () => {},
  loading: true,
  error: "",
  reFetch: () => {},
});

const localCart = localStorage.getItem("cart");

const initialCart: Cart = localCart ? JSON.parse(localCart) : emptyCart;

export default function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useUser();

  const { language } = useLanguage();

  const {
    privateRequest,
    loading,
    setLoading,
    error,
    setError,
    data,
    setData: setBaseData,
  } = useDataHandler<Cart>({ initialData: initialCart });

  function setData(cart: React.SetStateAction<Cart>) {
    setBaseData(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  useEffect(() => {
    // create guest cart in local storage
    if (!localCart) localStorage.setItem("cart", JSON.stringify(data));
    if (user && isCustomer(user.role)) fetchCart();
  }, [user]);

  function fetchCart() {
    handleRequest(language, setLoading, setError, async () => {
      const response = await privateRequest({ url: "cart", language });
      setData(response.data);
    });
  }

  return (
    <CartContext.Provider value={{ data, setData, loading, error, reFetch: fetchCart }}>{children}</CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
