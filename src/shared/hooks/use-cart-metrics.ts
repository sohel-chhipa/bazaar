import { useMemo } from "react";

import { useCartStore } from "@/shared/store/cart.store";

export const useCartMetrics = () => {
  const cartItems = useCartStore((state) => state.cartItems);

  return useMemo(() => {
    const quantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cartItems.reduce(
      (total, item) => total + item.discountedPrice * item.quantity,
      0,
    );

    return {
      quantity,
      subtotal,
      isEmpty: cartItems.length === 0,
    };
  }, [cartItems]);
};
