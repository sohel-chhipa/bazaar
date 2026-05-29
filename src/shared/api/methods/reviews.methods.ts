import { fetchProducts } from "@/shared/api/methods/products.methods";
import { generateReviewsFromProducts } from "@/shared/lib/dummy-adapters";
import type { ApiPaginatedResponse } from "@/shared/types/api.types";
import type { Review } from "@/shared/types/ecommerce.types";

export const fetchReviews = async (params?: { page?: number; perPage?: number }) => {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 100;
  const productsResponse = await fetchProducts({ page: 1, perPage: 200 });
  const allReviews = generateReviewsFromProducts(productsResponse.data);

  const start = (page - 1) * perPage;
  const end = start + perPage;

  return {
    data: allReviews.slice(start, end),
    currentPage: page,
    perPage,
    totalPages: Math.max(1, Math.ceil(allReviews.length / perPage)),
  } as ApiPaginatedResponse<Review>;
};

export const fetchReviewsByProduct = async (productId: number) => {
  const productsResponse = await fetchProducts({ page: 1, perPage: 200 });
  return generateReviewsFromProducts(productsResponse.data).filter(
    (review) => review.productId === productId,
  );
};
