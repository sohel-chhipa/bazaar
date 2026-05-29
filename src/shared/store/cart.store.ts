import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem, Product } from "@/shared/types/ecommerce.types";
import { storageService } from "@/shared/lib/storage.service";

interface CartStoreState {
  cartItems: CartItem[];
  recentlyViewed: number[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  addRecentlyViewed: (productId: number) => void;
}

const clampQuantity = (value: number, stock?: number) =>
  Math.max(1, typeof stock === "number" && stock > 0 ? Math.min(stock, value) : value);

export const useCartStore = create<CartStoreState>()(
  persist(
    (set) => ({
      cartItems: [],
      recentlyViewed: [],

      addToCart(product, quantity = 1) {
        set((state) => {
          const existing = state.cartItems.find((item) => item.productId === product._id);

          if (existing) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.productId === product._id
                  ? {
                      ...item,
                      quantity: clampQuantity(item.quantity + quantity, item.stock),
                    }
                  : item,
              ),
            };
          }

          return {
            cartItems: [
              {
                productId: product._id,
                title: product.title,
                image: product.image,
                price: product.price,
                discountedPrice: product.discountedPrice,
                quantity: clampQuantity(quantity, product.stock),
                stock: product.stock,
                brand: product.brand,
              },
              ...state.cartItems,
            ],
          };
        });
      },

      removeFromCart(productId) {
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.productId !== productId),
        }));
      },

      updateCartQuantity(productId, quantity) {
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity: clampQuantity(quantity, item.stock),
                }
              : item,
          ),
        }));
      },

      clearCart() {
        set({ cartItems: [] });
      },

      addRecentlyViewed(productId) {
        set((state) => ({
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 20),
        }));
      },
    }),
    {
      name: "bazaar-cart-store",
      partialize: (state) => ({
        cartItems: state.cartItems,
        recentlyViewed: state.recentlyViewed,
      }),
      storage: createJSONStorage(() => storageService),
    },
  ),
);
