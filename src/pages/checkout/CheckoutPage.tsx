import { ArrowRight, BadgePercent, CreditCard, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import {
  checkoutMock,
  type PlaceOrderPayload,
} from "@/mocks/services/checkout.mock";
import { PAGE_URLS } from "@/routes/page-urls";
import { useApiError } from "@/shared/hooks/use-api-error";
import RunAPI from "@/shared/api/RunAPI";
import { useAuthStore } from "@/shared/store/auth.store";
import { useCartStore } from "@/shared/store/cart.store";
import type { Coupon } from "@/shared/types/ecommerce.types";
import { formatCurrency } from "@/shared/lib/format";
import { Button, FormField, Input } from "@/shared/ui";
import {
  checkoutSchema,
  type CheckoutFormValues,
} from "@/shared/validation/schemas/checkout.schema";

const paymentOptions = [
  { label: "Credit / Debit Card", value: "card" },
  { label: "Cash on Delivery", value: "cod" },
];

const billingCountryOptions = [
  { label: "India", value: "India" },
  { label: "United States", value: "United States" },
  { label: "UAE", value: "UAE" },
];

function CheckoutPage() {
  const navigate = useNavigate();
  const { onApiError } = useApiError();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);

  const [promoCode, setPromoCode] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      phone: "",
      shippingAddress: "",
      city: "",
      stateName: "",
      postalCode: "",
      paymentMethod: "card",
      cardNumber: "",
      expiry: "",
      cvc: "",
      cardholderName: "",
      billingCountry: "India",
      promoCode: "",
    },
  });

  const paymentMethod = form.watch("paymentMethod");
  const isPlacingOrder = form.formState.isSubmitting;

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.discountedPrice * item.quantity, 0),
    [cartItems],
  );

  const discountAmount = useMemo(
    () => Math.min(subtotal, Math.max(0, discount)),
    [subtotal, discount],
  );
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const shippingFee = subtotal > 120 ? 0 : 9.99;
  const total = discountedSubtotal + shippingFee;

  useEffect(() => {
    const loadCoupons = async () => {
      const coupons = await checkoutMock.getCoupons();
      setAvailableCoupons(coupons.slice(0, 4));
    };

    void loadCoupons();
  }, []);

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const result = await checkoutMock.applyCoupon({
        code: promoCode.trim(),
        subtotal,
      });

      setAppliedCoupon(result.coupon);
      setDiscount(Math.min(subtotal, Math.max(0, result.discount)));
    } catch {
      onApiError(null, {
        title: "Promo code failed",
        message: "Could not apply this promo code.",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const placeOrder = form.handleSubmit(async (values) => {
    if (!user) {
      return;
    }

    const mergedAddress = `${values.shippingAddress}, ${values.city}, ${values.stateName}, ${values.postalCode}`;

    const api = new RunAPI<PlaceOrderPayload, Awaited<ReturnType<typeof checkoutMock.placeOrder>>>();
    api.setConfig({
      loaderKey: "checkout-place-order",
      apiHandler: {
        fetch: ({ data }) => checkoutMock.placeOrder(data as PlaceOrderPayload),
      },
      onSuccess: (order) => {
        clearCart();
        navigate(PAGE_URLS.ORDER_PLACED, {
          state: {
            orderId: order.id,
          },
        });
      },
      onError: (error) => {
        onApiError(error, {
          title: "Order placement failed",
          message: "We could not place your order at the moment.",
        });
      },
    });

    if (values.paymentMethod === "cod") {
      try {
        await api.executeFetch({
          data: {
            userId: user._id,
            items: cartItems,
            subtotal,
            discount: discountAmount,
            total,
            shippingAddress: mergedAddress,
            paymentMethod: values.paymentMethod,
            promoCode: appliedCoupon?.code,
          },
        });
      } catch {
        // handled in onError
      }
    } else {
      navigate(PAGE_URLS.PAYMENT_OTP, {
        state: {
          pendingOrder: {
            userId: user._id,
            subtotal,
            discount: discountAmount,
            total,
            shippingAddress: mergedAddress,
            paymentMethod: values.paymentMethod,
            promoCode: appliedCoupon?.code,
          },
        },
      });
    }
  });

  if (!cartItems.length) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add products before moving to checkout.
          </p>
          <Link
            to={PAGE_URLS.PRODUCTS}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Continue shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">Checkout</h1>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5 rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
          <div>
            <h2 className="inline-flex items-center gap-2 text-xl font-semibold">
              <MapPin className="h-5 w-5 text-primary" />
              Contact Information
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Delivering for {user?.email}. Fill complete shipping details below.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="fullName"
              label="Full name"
              inputProps={{ placeholder: "Full name" }}
            />
            <FormField
              control={form.control}
              name="phone"
              label="Phone number"
              inputProps={{ placeholder: "Phone number", inputMode: "tel" }}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField control={form.control} name="city" label="City" inputProps={{ placeholder: "City" }} />
            <FormField
              control={form.control}
              name="stateName"
              label="State"
              inputProps={{ placeholder: "State" }}
            />
            <FormField
              control={form.control}
              name="postalCode"
              label="Postal code"
              inputProps={{ placeholder: "Postal code" }}
            />
          </div>

          <FormField
            control={form.control}
            name="shippingAddress"
            type="textarea"
            label="Shipping address"
            textareaProps={{
              placeholder: "House number, street, city, state, ZIP code",
              rows: 4,
            }}
          />

          <div className="space-y-4 rounded-2xl border border-border p-4">
            <h3 className="inline-flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Method
            </h3>
            <FormField
              control={form.control}
              name="paymentMethod"
              type="select"
              label="Payment type"
              options={paymentOptions}
            />

            {paymentMethod === "card" ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-xl border border-input bg-background">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    inputProps={{
                      placeholder: "1234 1234 1234 1234",
                      className: "h-11 border-0 px-3 focus:ring-0",
                      onChange: (event) => {
                        const formatted = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 19)
                          .replace(/(\d{4})(?=\d)/g, "$1 ");
                        form.setValue("cardNumber", formatted);
                      },
                    }}
                  />
                  <div className="grid grid-cols-2 border-t border-input">
                    <FormField
                      control={form.control}
                      name="expiry"
                      inputProps={{
                        placeholder: "MM / YY",
                        className: "h-10 rounded-none border-0 border-r border-input focus:ring-0",
                        onChange: (event) => {
                          const formatted = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4)
                            .replace(/(\d{2})(\d{1,2})/, "$1/$2");
                          form.setValue("expiry", formatted);
                        },
                      }}
                    />
                    <FormField
                      control={form.control}
                      name="cvc"
                      inputProps={{
                        placeholder: "CVC",
                        className: "h-10 rounded-none border-0 focus:ring-0",
                        onChange: (event) => {
                          form.setValue("cvc", event.target.value.replace(/\D/g, "").slice(0, 4));
                        },
                      }}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="cardholderName"
                  label="Cardholder name"
                  inputProps={{ placeholder: "Cardholder name" }}
                />
                <FormField
                  control={form.control}
                  name="billingCountry"
                  type="select"
                  label="Billing country"
                  options={billingCountryOptions}
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-3 rounded-2xl border border-border p-4">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold">
              <BadgePercent className="h-4 w-4 text-primary" />
              Promo Code
            </h3>
            <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
              <Input
                value={promoCode}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Enter promo code"
              />
              <Button isLoading={isApplyingCoupon} onClick={() => void applyPromoCode()}>
                Apply
              </Button>
            </div>

            {availableCoupons.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {availableCoupons.map((coupon) => (
                  <button
                    key={coupon._id}
                    type="button"
                    onClick={() => setPromoCode(coupon.code)}
                    className="rounded-full border border-input bg-background px-3 py-1 text-xs font-medium hover:bg-muted"
                  >
                    {coupon.code}
                  </button>
                ))}
              </div>
            ) : null}

            {appliedCoupon ? (
              <p className="text-xs text-success">
                {appliedCoupon.code} applied successfully: -{formatCurrency(discountAmount)}
              </p>
            ) : null}
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
          <h2 className="text-2xl font-semibold">Bill Summary</h2>

          <div className="mt-4 rounded-2xl bg-secondary p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-semibold">-{formatCurrency(discountAmount)}</span>
                </div>
              ) : null}
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">
                  {shippingFee ? formatCurrency(shippingFee) : "Free"}
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-outline-secondary pt-3">
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold">Total Payable</span>
                <span className="text-xl font-semibold">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <Button className="mt-5 h-11 w-full rounded-xl" isLoading={isPlacingOrder} onClick={() => void placeOrder()}>
            {paymentMethod === "cod" ? "Place order" : "Continue to payment"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            By placing this order, you agree to Bazaar terms and secure payment policy.
          </p>
        </aside>
      </section>
    </div>
  );
}

export default CheckoutPage;
