import { CalendarDays, PackageCheck } from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { useOrderStore } from "@/shared/store/order.store";
import type { LocalOrder } from "@/shared/types/ecommerce.types";
import { formatCurrency, formatDate } from "@/shared/lib/format";

function OrdersPage() {
  const localOrders = useOrderStore((state) => state.localOrders);

  const orders = useMemo<LocalOrder[]>(
    () =>
      [...localOrders].sort(
        (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      ),
    [localOrders],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">My Orders</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Track your purchases, review statuses, and revisit order details anytime.
        </p>
      </section>

      <section className="space-y-3">
        {orders.length ? (
          orders.map((order) => (
            <article key={order.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    <PackageCheck className="h-4 w-4" />
                    {order.id}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatDate(order.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
                  {order.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={`${order.id}-${item.productId}`}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="line-clamp-1 pr-3 text-muted-foreground">
                      {item.title} x {item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(item.discountedPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total amount</span>
                  <span className="font-semibold">{formatCurrency(order.total)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Payment: {order.paymentMethod}</p>
                <Link
                  to={PAGE_URLS.ORDER_DETAILS.replace(":orderId", encodeURIComponent(order.id))}
                  className="mt-3 inline-flex rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent"
                >
                  View details
                </Link>
              </div>
            </article>
          ))
        ) : (
          <article className="rounded-2xl border border-border bg-card p-6 text-center">
            <h2 className="text-xl font-semibold">No orders yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Start with a product and place your first order.
            </p>
            <Link
              to={PAGE_URLS.PRODUCTS}
              className="mt-4 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Browse products
            </Link>
          </article>
        )}
      </section>
    </div>
  );
}

export default OrdersPage;
