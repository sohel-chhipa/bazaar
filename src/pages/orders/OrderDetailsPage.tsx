import { CheckCircle2, Circle, CreditCard, MapPin, Package, Truck } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { useOrderStore } from "@/shared/store/order.store";
import { formatCurrency, formatDate } from "@/shared/lib/format";

const trackingSteps = [
  { id: "placed", label: "Order placed", icon: CheckCircle2 },
  { id: "confirmed", label: "Payment confirmed", icon: CreditCard },
  { id: "packed", label: "Packed", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "delivered", label: "Delivered", icon: MapPin },
];

function OrderDetailsPage() {
  const { orderId } = useParams();
  const localOrders = useOrderStore((state) => state.localOrders);

  const order = useMemo(() => {
    if (!orderId) return null;
    return localOrders.find((item) => item.id === decodeURIComponent(orderId)) ?? null;
  }, [localOrders, orderId]);

  const activeStepIndex = order?.status === "Placed" ? 2 : 1;

  if (!order) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-card p-6 text-center">
          <h1 className="text-2xl font-semibold">Order not found</h1>
          <p className="mt-2 text-sm text-muted-foreground">This order detail is unavailable.</p>
          <Link
            to={PAGE_URLS.MY_ORDERS}
            className="mt-4 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Back to orders
          </Link>
        </div>
      </div>
    );
  }

  const normalizedSubtotal = Math.max(0, order.subtotal);
  const normalizedDiscount = Math.min(normalizedSubtotal, Math.max(0, order.discount));
  const normalizedTotal = Math.max(0, order.total);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Order ID</p>
            <h1 className="mt-1 text-2xl font-semibold">{order.id}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{order.status}</span>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {trackingSteps.map((step, index) => {
            const done = index <= activeStepIndex;
            const Icon = done ? step.icon : Circle;
            return (
              <div key={step.id} className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${done ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs ${done ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-xl font-semibold">Products in this order</h2>
          {order.items.map((item) => (
            <article key={`${order.id}-${item.productId}`} className="rounded-2xl bg-secondary p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">Qty {item.quantity} • {item.brand}</p>
                </div>
                <p className="text-sm font-semibold">{formatCurrency(item.discountedPrice * item.quantity)}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="text-lg font-semibold">Payment Info</h3>
            <p className="mt-3 text-sm text-muted-foreground">Method: {order.paymentMethod.toUpperCase()}</p>
            <p className="mt-1 text-sm text-muted-foreground">Promo: {order.promoCode || "Not applied"}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="text-lg font-semibold">Bill Summary</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatCurrency(normalizedSubtotal)}</span></div>
              {normalizedDiscount > 0 ? (
                <div className="flex items-center justify-between"><span className="text-muted-foreground">Discount</span><span>-{formatCurrency(normalizedDiscount)}</span></div>
              ) : null}
              <div className="flex items-center justify-between border-t border-border pt-2"><span className="font-semibold">Total</span><span className="font-semibold">{formatCurrency(normalizedTotal)}</span></div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h3 className="text-lg font-semibold">Shipping Address</h3>
            <p className="mt-3 text-sm text-muted-foreground">{order.shippingAddress}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default OrderDetailsPage;
