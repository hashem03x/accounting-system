import { ContextProps } from "@/types/global";
import { Product, Variant } from "./product";

export type CartItem = {
  _id: string;
  variant: Variant & { productId: Product };
  quantity: number;
};

export type Cart = {
  _id: string;
  cartItems: CartItem[];
  discount: number;
  totalCartPrice: number;
  totalCartPriceAfterDiscount: number;
};

export type CartContextProps = ContextProps<Cart>;
