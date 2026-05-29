import { create } from "zustand";

import { fetchSuggestedProducts } from "@/shared/api/methods/products.methods";
import { catalogMock } from "@/mocks/services/catalog.mock";
import type { Product } from "@/shared/types/ecommerce.types";

interface HomeStoreState {
  heroProducts: Product[];
  collectionProducts: Product[];
  suggestedProducts: Product[];
  recentlyViewedProducts: Product[];
  isLoading: boolean;
  lastFetchedAt: number;
  loadHomeData: (force?: boolean) => Promise<void>;
  loadRecentlyViewed: (productIds: number[]) => Promise<void>;
}

const HOME_TTL_MS = 5 * 60 * 1000;

export const useHomeStore = create<HomeStoreState>((set, get) => ({
  heroProducts: [],
  collectionProducts: [],
  suggestedProducts: [],
  recentlyViewedProducts: [],
  isLoading: false,
  lastFetchedAt: 0,

  async loadHomeData(force = false) {
    const { lastFetchedAt, isLoading } = get();
    const isFresh = Date.now() - lastFetchedAt < HOME_TTL_MS;

    if (!force && (isLoading || isFresh)) {
      return;
    }

    set({ isLoading: true });

    try {
      const [catalog, suggested] = await Promise.all([
        catalogMock.getCatalogData({ page: 1, perPage: 24, sort: "featured" }),
        fetchSuggestedProducts(),
      ]);

      set({
        heroProducts: catalog.featuredProducts.slice(0, 6),
        collectionProducts: catalog.products,
        suggestedProducts: suggested.slice(0, 8),
        isLoading: false,
        lastFetchedAt: Date.now(),
      });
    } catch {
      set({ isLoading: false });
      throw new Error("Home unavailable");
    }
  },

  async loadRecentlyViewed(productIds: number[]) {
    if (!productIds.length) {
      set({ recentlyViewedProducts: [] });
      return;
    }

    try {
      const products = await catalogMock.getRecentlyViewedProducts(productIds.slice(0, 10));
      set({ recentlyViewedProducts: products });
    } catch {
      set({ recentlyViewedProducts: [] });
    }
  },
}));
