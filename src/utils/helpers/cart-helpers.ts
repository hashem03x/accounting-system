import { Cart } from "@/types/cart";

export const emptyCart: Cart = {
  _id: "guest",
  cartItems: [],
  discount: 0,
  totalCartPrice: 0,
  totalCartPriceAfterDiscount: 0,
};
