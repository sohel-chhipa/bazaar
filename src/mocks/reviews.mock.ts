import type { Product, Review } from "@/shared/types/ecommerce.types";

export const generateReviewsFromProducts = (products: Product[]): Review[] =>
  products.slice(0, 120).map((product, index) => ({
    _id: index + 1,
    userId: (index % 20) + 1,
    productId: product._id,
    rating: Math.max(1, Math.min(5, Math.round(product.rating))),
    comment: `Great value for ${product.title}. Quality and pricing feel balanced for everyday shopping.`,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  }));
