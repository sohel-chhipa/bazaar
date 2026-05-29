import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { useOrderStore } from "@/shared/store/order.store";
import { formatCurrency, formatDate } from "@/shared/lib/format";

interface OrderPlacedState {
  orderId?: string;
}

function OrderPlacedPage() {
  const location = useLocation();
  const state = location.state as OrderPlacedState | null;

  const localOrders = useOrderStore((store) => store.localOrders);
  const lastPlacedOrderId = useOrderStore((store) => store.lastPlacedOrderId);

  const order = useMemo(() => {
    const resolvedOrderId = state?.orderId ?? lastPlacedOrderId;

    if (!resolvedOrderId) {
      return null;
    }

    return localOrders.find((item) => item.id === resolvedOrderId) ?? null;
  }, [lastPlacedOrderId, localOrders, state?.orderId]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-border bg-card p-6 text-center sm:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-9 w-9" />
        </div>

        <h1 className="mt-4 text-2xl font-semibold sm:text-3xl lg:text-4xl">Order placed successfully</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Thank you for shopping with Bazaar. Your purchase is confirmed and we are preparing
          dispatch.
        </p>

        {order ? (
          <div className="mx-auto mt-6 max-w-md rounded-2xl border border-border bg-secondary p-4 text-left">
            <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
              Order details
            </p>
            <p className="mt-1 text-sm font-semibold">{order.id}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Placed on {formatDate(order.createdAt)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Total paid {formatCurrency(order.total)}
            </p>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to={PAGE_URLS.MY_ORDERS}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            View my orders
          </Link>
          <Link
            to={PAGE_URLS.PRODUCTS}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue shopping
          </Link>
        </div>
      </section>
    </div>
  );
}

export default OrderPlacedPage;
