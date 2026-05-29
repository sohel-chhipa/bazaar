import { toSafeNumber } from "@/shared/lib/format";
import type { Category, Product, Review, User } from "@/shared/types/ecommerce.types";

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

interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  email: string;
  phone?: string;
  username?: string;
  role?: string;
}

export interface DummyListResponse<T> {
  total: number;
  skip: number;
  limit: number;
  products?: T[];
  users?: T[];
}

export const toPaginatedMeta = (total: number, skip: number, limit: number) => {
  const currentPage = Math.floor(skip / Math.max(limit, 1)) + 1;
  return {
    currentPage,
    perPage: limit,
    totalPages: Math.max(1, Math.ceil(total / Math.max(limit, 1))),
  };
};

export const mapDummyProductToProduct = (item: DummyProduct): Product => {
  const price = toSafeNumber(item.price);
  const discountPercentage = toSafeNumber(item.discountPercentage);
  const discountedPrice = Math.max(1, price - (price * discountPercentage) / 100);

  return {
    _id: toSafeNumber(item.id),
    title: item.title,
    description: item.description,
    category: item.category,
    type: item.category,
    price,
    discountedPrice,
    oldPrice: String(price.toFixed(2)),
    stock: Math.max(0, Math.round(toSafeNumber(item.stock))),
    rating: toSafeNumber(item.rating),
    brand: item.brand || "Generic",
    size: ["S", "M", "L", "XL"],
    image: item.thumbnail || item.images?.[0] || "",
    isNew: toSafeNumber(item.id) % 2 === 0,
  };
};

export const mapCategoryNameToCategory = (name: string, index: number): Category => ({
  _id: index + 1,
  name,
  description: `${name} products`,
  parentId: null,
});

export const mapDummyUserToUser = (item: DummyUser): User => ({
  _id: item.id,
  name: `${item.firstName} ${item.lastName}`,
  username: item.username || item.maidenName || item.firstName.toLowerCase(),
  email: item.email,
  phone: item.phone,
  role: item.role || "Customer",
  status: "Active",
});

export const generateReviewsFromProducts = (products: Product[]): Review[] =>
  products.slice(0, 120).map((product, index) => ({
    _id: index + 1,
    userId: (index % 20) + 1,
    productId: product._id,
    rating: Math.max(1, Math.min(5, Math.round(product.rating))),
    comment: `Great value for ${product.title}. Quality and pricing feel balanced for everyday shopping.`,
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  }));
