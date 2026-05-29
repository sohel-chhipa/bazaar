import { getFallbackCoupons } from "@/mocks/checkout.mock";
import { useOrderStore } from "@/shared/store/order.store";
import type { CartItem, Coupon, LocalOrder } from "@/shared/types/ecommerce.types";

export interface ApplyCouponPayload {
  code: string;
  subtotal: number;
}

export interface PlaceOrderPayload {
  userId: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  promoCode?: string;
}

const calculateDiscount = (coupon: Coupon, subtotal: number) => {
  if (coupon.discountType === "Percentage") {
    return (subtotal * coupon.discountValue) / 100;
  }

  return coupon.discountValue;
};

export const checkoutMock = {
  async getCoupons() {
    return getFallbackCoupons().slice(0, 10);
  },

  async applyCoupon(payload: ApplyCouponPayload) {
    const normalizedCode = payload.code.trim().toUpperCase();
    const coupons = await this.getCoupons();
    const coupon =
      coupons.find((item) => item.code.toLowerCase() === normalizedCode.toLowerCase()) ??
      ({
        _id: Date.now(),
        code: normalizedCode,
        discountType: "Percentage",
        discountValue: 10,
        minOrderAmount: 0,
        expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        status: "Active",
      } satisfies Coupon);

    const safeSubtotal = Math.max(0, payload.subtotal);
    const calculatedDiscount = calculateDiscount(coupon, safeSubtotal);
    const discount = Math.min(safeSubtotal, Math.max(0, calculatedDiscount));

    return {
      coupon,
      discount,
    };
  },

  async placeOrder(payload: PlaceOrderPayload) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const order: LocalOrder = {
      id: `BAZAR-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: payload.userId,
      createdAt: new Date().toISOString(),
      status: "Placed",
      items: payload.items,
      subtotal: payload.subtotal,
      discount: payload.discount,
      total: payload.total,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod,
      promoCode: payload.promoCode,
    };

    useOrderStore.getState().addLocalOrder(order);

    return order;
  },
};
