import { create } from "zustand";

import { catalogMock } from "@/mocks/services/catalog.mock";
import type { Category, Product } from "@/shared/types/ecommerce.types";

interface CatalogFilters {
  category: string;
  query: string;
  sort: "featured" | "price-asc" | "price-desc" | "rating-desc";
  brand: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  minDiscountPercent: number;
}

interface CatalogStoreState {
  categories: Category[];
  products: Product[];
  totalItems: number;
  page: number;
  hasNextPage: boolean;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  filters: CatalogFilters;
  setFilters: (next: Partial<CatalogFilters>) => void;
  loadInitial: () => Promise<void>;
  loadMore: () => Promise<void>;
}

const defaultFilters: CatalogFilters = {
  category: "all",
  query: "",
  sort: "featured",
  brand: "all",
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  minDiscountPercent: 0,
};

export const useCatalogStore = create<CatalogStoreState>((set, get) => ({
  categories: [],
  products: [],
  totalItems: 0,
  page: 1,
  hasNextPage: true,
  isLoading: false,
  isFetchingNextPage: false,
  filters: defaultFilters,

  setFilters(next) {
    set((state) => ({ filters: { ...state.filters, ...next } }));
  },

  async loadInitial() {
    const { filters, isLoading } = get();
    if (isLoading) return;
    set({ isLoading: true, page: 1 });

    const response = await catalogMock.getCatalogData({
      page: 1,
      perPage: 12,
      ...filters,
    });

    set({
      categories: response.categories,
      products: response.products,
      totalItems: response.pagination.totalItems,
      hasNextPage: response.pagination.currentPage < response.pagination.totalPages,
      isLoading: false,
      isFetchingNextPage: false,
    });
  },

  async loadMore() {
    const { isFetchingNextPage, isLoading, hasNextPage, page, filters } = get();
    if (isLoading || isFetchingNextPage || !hasNextPage) return;

    const nextPage = page + 1;
    set({ isFetchingNextPage: true });

    const response = await catalogMock.getCatalogData({
      page: nextPage,
      perPage: 12,
      ...filters,
    });

    set((state) => ({
      products: [...state.products, ...response.products],
      page: nextPage,
      totalItems: response.pagination.totalItems,
      hasNextPage: response.pagination.currentPage < response.pagination.totalPages,
      isFetchingNextPage: false,
    }));
  },
}));
