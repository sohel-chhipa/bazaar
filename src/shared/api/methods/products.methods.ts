import { API_URLS } from "@/shared/constants/api.constants";
import {
  mapDummyProductToProduct,
  toPaginatedMeta,
  type DummyListResponse,
} from "@/shared/lib/dummy-adapters";
import { httpGet } from "@/shared/api/methods/http.methods";
import type { ApiPaginatedResponse } from "@/shared/types/api.types";
import type { Product } from "@/shared/types/ecommerce.types";

interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail?: string;
  images?: string[];
}

export const fetchProducts = async (params?: { page?: number; perPage?: number }) => {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 12;
  const skip = (page - 1) * perPage;

  const response = await httpGet<DummyListResponse<DummyProduct>>(API_URLS.products.list, {
    limit: perPage,
    skip,
  });

  const data = (response.products ?? []).map(mapDummyProductToProduct);

  return {
    data,
    ...toPaginatedMeta(response.total, response.skip, response.limit),
  } as ApiPaginatedResponse<Product>;
};

export const fetchProductById = async (productId: number) => {
  const product = await httpGet<DummyProduct>(API_URLS.products.byId(productId));
  return mapDummyProductToProduct(product);
};

export const fetchSuggestedProducts = async () => {
  const response = await httpGet<DummyListResponse<DummyProduct>>(API_URLS.products.list, {
    limit: 120,
    skip: 0,
  });

  const normalized = (response.products ?? []).map(mapDummyProductToProduct);
  const shuffled = [...normalized].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 12);
};
