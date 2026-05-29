import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { HomeListingPayload } from "@/shared/types/catalog.types";
import { storageService } from "@/shared/lib/storage.service";

interface AppStoreState {
  searchQuery: string;
  cartCount: number;
  mobileMenuOpen: boolean;
  homeListingData: HomeListingPayload | null;
  isHomeListingLoading: boolean;
  homeListingError: string;
  setSearchQuery: (value: string) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  addToCart: (quantity?: number) => void;
  setHomeListingLoading: (isLoading: boolean) => void;
  setHomeListingData: (payload: HomeListingPayload) => void;
  setHomeListingError: (message: string) => void;
}

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      searchQuery: "",
      cartCount: 3,
      mobileMenuOpen: false,
      homeListingData: null,
      isHomeListingLoading: true,
      homeListingError: "",
      setSearchQuery(value) {
        set({ searchQuery: value });
      },
      toggleMobileMenu() {
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },
      closeMobileMenu() {
        set({ mobileMenuOpen: false });
      },
      addToCart(quantity = 1) {
        set((state) => ({ cartCount: Math.max(0, state.cartCount + quantity) }));
      },
      setHomeListingLoading(isHomeListingLoading) {
        set({ isHomeListingLoading });
      },
      setHomeListingData(homeListingData) {
        set({ homeListingData });
      },
      setHomeListingError(homeListingError) {
        set({ homeListingError });
      },
    }),
    {
      name: "bazaar-app-store",
      partialize: (state) => ({
        cartCount: state.cartCount,
        searchQuery: state.searchQuery,
      }),
      storage: createJSONStorage(() => storageService),
    },
  ),
);
