import { Landmark, ShieldCheck } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation, useNavigate } from "react-router-dom";

import { checkoutMock, type PlaceOrderPayload } from "@/mocks/services/checkout.mock";
import { PAGE_URLS } from "@/routes/page-urls";
import RunAPI from "@/shared/api/RunAPI";
import { useCartStore } from "@/shared/store/cart.store";
import { Button, FormField } from "@/shared/ui";

const paymentOtpSchema = z.object({
  otp: z.string().min(6, "Enter the 6-digit OTP").max(6, "OTP must be 6 digits"),
});

type PaymentOtpForm = z.infer<typeof paymentOtpSchema>;

interface PaymentOtpState {
  pendingOrder?: {
    userId: number;
    subtotal: number;
    discount: number;
    total: number;
    shippingAddress: string;
    paymentMethod: string;
    promoCode?: string;
  };
}

function PaymentOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);

  const state = location.state as PaymentOtpState | null;
  const pendingOrder = state?.pendingOrder;

  const form = useForm<PaymentOtpForm>({
    resolver: zodResolver(paymentOtpSchema),
    defaultValues: { otp: "" },
  });

  const otp = form.watch("otp");
  const isVerifying = form.formState.isSubmitting;
  const canContinue = useMemo(() => otp.trim().length === 6, [otp]);

  const confirmPayment = form.handleSubmit(async ({ otp: submittedOtp }) => {
    if (!pendingOrder) {
      navigate(PAGE_URLS.CHECKOUT, { replace: true });
      return;
    }

    if (submittedOtp !== "123456") {
      form.setError("otp", {
        message: "Invalid OTP. Please enter the correct 6-digit bank code.",
      });
      return;
    }

    const api = new RunAPI<PlaceOrderPayload, Awaited<ReturnType<typeof checkoutMock.placeOrder>>>();
    api.setConfig({
      loaderKey: "payment-verify-otp",
      apiHandler: {
        fetch: ({ data }) => checkoutMock.placeOrder(data as PlaceOrderPayload),
      },
      onSuccess: (order) => {
        clearCart();
        navigate(PAGE_URLS.ORDER_PLACED, { state: { orderId: order.id } });
      },
      onError: (error) => {
        const errorMessage =
          typeof error === "object" && error && "message" in error
            ? String((error as { message?: string }).message ?? "")
            : "";
        form.setError("otp", {
          message: errorMessage || "Payment failed. Please try again.",
        });
      },
    });

    try {
      await api.executeFetch({
        data: {
          ...pendingOrder,
          items: cartItems,
        },
      });
    } catch {
      // handled in onError
    }
  });

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 py-10">
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <header className="bg-information px-5 py-4 text-primary-foreground">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em]">
            <Landmark className="h-4 w-4" /> SBI Secure Bank
          </p>
          <h1 className="mt-2 text-xl font-semibold">Card Payment OTP Verification</h1>
          <p className="mt-1 text-xs text-primary-foreground/80">
            For your security, never share OTP with anyone.
          </p>
        </header>

        <form className="space-y-4 px-5 py-6" onSubmit={confirmPayment}>
          <div className="rounded-xl border border-border bg-subtle p-3 text-sm text-foreground">
            Enter the 6-digit one-time password sent to your registered mobile number.
          </div>

          <FormField
            control={form.control}
            name="otp"
            label="One-time password"
            inputProps={{
              placeholder: "Enter OTP",
              inputMode: "numeric",
              inputSize: "lg",
              className: "text-center text-lg tracking-[0.3em]",
              maxLength: 6,
              onChange: (event) => {
                form.setValue("otp", event.target.value.replace(/\D/g, "").slice(0, 6), {
                  shouldValidate: true,
                });
              },
            }}
          />

          <Button
            type="submit"
            className="h-12 w-full rounded-xl"
            isLoading={isVerifying}
            disabled={!canContinue}
            rightIcon={<ShieldCheck className="h-4 w-4" />}
          >
            Verify and continue
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Mock OTP for test flow: <span className="font-semibold text-foreground">123456</span>
          </p>
        </form>
      </section>
    </div>
  );
}

export default PaymentOtpPage;
