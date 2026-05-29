import type { Coupon } from "@/shared/types/ecommerce.types";

export const getFallbackCoupons = (): Coupon[] =>
  Array.from({ length: 10 }).map((_, index) => ({
    _id: index + 1,
    code: `SAVE${(index + 1) * 5}`,
    discountType: "Percentage",
    discountValue: (index + 1) * 5,
    minOrderAmount: 0,
    expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    status: "Active",
  }));
