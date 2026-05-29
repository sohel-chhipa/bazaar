import { API_URLS } from "@/shared/constants/api.constants";
import { mapCategoryNameToCategory } from "@/shared/lib/dummy-adapters";
import { httpGet } from "@/shared/api/methods/http.methods";
import type { ApiPaginatedResponse } from "@/shared/types/api.types";
import type { Category } from "@/shared/types/ecommerce.types";

export const fetchCategories = async (params?: { page?: number; perPage?: number }) => {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 50;

  const response = await httpGet<string[]>(API_URLS.products.categoryList);
  const mapped = response.map((name, index) => mapCategoryNameToCategory(name, index));

  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    data: mapped.slice(start, end),
    currentPage: page,
    perPage,
    totalPages: Math.max(1, Math.ceil(mapped.length / perPage)),
  } as ApiPaginatedResponse<Category>;
};
