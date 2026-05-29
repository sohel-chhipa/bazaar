import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Product, WishlistItem } from "@/shared/types/ecommerce.types";
import { storageService } from "@/shared/lib/storage.service";

interface WishlistStoreState {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

const mapProductToWishlistItem = (product: Product): WishlistItem => ({
  productId: product._id,
  title: product.title,
  image: product.image,
  price: product.price,
  discountedPrice: product.discountedPrice,
  stock: product.stock,
  brand: product.brand,
  category: product.category,
  rating: product.rating,
  isNew: product.isNew,
});

export const useWishlistStore = create<WishlistStoreState>()(
  persist(
    (set) => ({
      wishlistItems: [],

      addToWishlist(product) {
        set((state) => {
          if (state.wishlistItems.some((item) => item.productId === product._id)) {
            return state;
          }

          return {
            wishlistItems: [mapProductToWishlistItem(product), ...state.wishlistItems],
          };
        });
      },

      removeFromWishlist(productId) {
        set((state) => ({
          wishlistItems: state.wishlistItems.filter((item) => item.productId !== productId),
        }));
      },

      toggleWishlist(product) {
        set((state) => {
          const exists = state.wishlistItems.some((item) => item.productId === product._id);
          return {
            wishlistItems: exists
              ? state.wishlistItems.filter((item) => item.productId !== product._id)
              : [mapProductToWishlistItem(product), ...state.wishlistItems],
          };
        });
      },

      clearWishlist() {
        set({ wishlistItems: [] });
      },
    }),
    {
      name: "bazaar-wishlist-store",
      partialize: (state) => ({
        wishlistItems: state.wishlistItems,
      }),
      storage: createJSONStorage(() => storageService),
    },
  ),
);
