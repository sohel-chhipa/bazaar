import { fetchCategories } from "@/shared/api/methods/categories.methods";
import { fetchProducts, fetchProductById, fetchSuggestedProducts } from "@/shared/api/methods/products.methods";
import { fetchReviewsByProduct } from "@/shared/api/methods/reviews.methods";
import type { Product } from "@/shared/types/ecommerce.types";

interface CatalogFilter {
  page: number;
  perPage: number;
  query?: string;
  category?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "rating-desc";
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  minDiscountPercent?: number;
}

const sortProducts = (products: Product[], sort: CatalogFilter["sort"]) => {
  switch (sort) {
    case "price-asc":
      return [...products].sort((left, right) => left.discountedPrice - right.discountedPrice);
    case "price-desc":
      return [...products].sort((left, right) => right.discountedPrice - left.discountedPrice);
    case "rating-desc":
      return [...products].sort((left, right) => right.rating - left.rating);
    default:
      return products;
  }
};

export const catalogMock = {
  async getCatalogData(filters: CatalogFilter) {
    const [categoriesResponse, productsResponse] = await Promise.all([
      fetchCategories({ page: 1, perPage: 100 }),
      fetchProducts({ page: 1, perPage: 400 }),
    ]);

    const query = filters.query?.trim().toLowerCase();
    let filteredProducts = productsResponse.data;

    if (filters.category && filters.category !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.category.toLowerCase() === filters.category?.toLowerCase(),
      );
    }

    if (query) {
      filteredProducts = filteredProducts.filter((product) => {
        const text =
          `${product.title} ${product.brand} ${product.type} ${product.category}`.toLowerCase();
        return text.includes(query);
      });
    }

    if (filters.brand && filters.brand !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) => product.brand.toLowerCase() === filters.brand?.toLowerCase(),
      );
    }

    if (typeof filters.minPrice === "number") {
      filteredProducts = filteredProducts.filter(
        (product) => product.discountedPrice >= filters.minPrice!,
      );
    }

    if (typeof filters.maxPrice === "number" && Number.isFinite(filters.maxPrice)) {
      filteredProducts = filteredProducts.filter(
        (product) => product.discountedPrice <= filters.maxPrice!,
      );
    }

    if (typeof filters.minRating === "number" && filters.minRating > 0) {
      filteredProducts = filteredProducts.filter((product) => product.rating >= filters.minRating!);
    }

    if (filters.inStockOnly) {
      filteredProducts = filteredProducts.filter((product) => product.stock > 0);
    }

    if (typeof filters.minDiscountPercent === "number" && filters.minDiscountPercent > 0) {
      filteredProducts = filteredProducts.filter((product) => {
        const safePrice = Math.max(1, product.price);
        const discountPercent = ((safePrice - product.discountedPrice) / safePrice) * 100;
        return discountPercent >= filters.minDiscountPercent!;
      });
    }

    const sorted = sortProducts(filteredProducts, filters.sort);
    const start = (filters.page - 1) * filters.perPage;
    const end = start + filters.perPage;

    return {
      categories: categoriesResponse.data,
      products: sorted.slice(start, end),
      pagination: {
        currentPage: filters.page,
        perPage: filters.perPage,
        totalItems: sorted.length,
        totalPages: Math.max(1, Math.ceil(sorted.length / filters.perPage)),
      },
      featuredProducts: productsResponse.data.slice(0, 6),
    };
  },

  async getProductDetails(productId: number) {
    const [product, allProducts, reviews] = await Promise.all([
      fetchProductById(productId),
      fetchProducts({ page: 1, perPage: 400 }),
      fetchReviewsByProduct(productId),
    ]);

    const relatedProducts = allProducts.data
      .filter((item) => item._id !== product._id && item.category === product.category)
      .slice(0, 8);

    const suggestedProducts = (await fetchSuggestedProducts()).filter(
      (item) => item._id !== product._id,
    );

    return {
      product,
      reviews,
      relatedProducts,
      suggestedProducts: suggestedProducts.slice(0, 8),
    };
  },

  async getRecentlyViewedProducts(productIds: number[]) {
    if (!productIds.length) {
      return [];
    }

    const response = await fetchProducts({ page: 1, perPage: 400 });

    return productIds
      .map((id) => response.data.find((product) => product._id === id))
      .filter((product): product is Product => Boolean(product));
  },
};
