import { Minus, Plus, ShoppingBag, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { ProductRail } from "@/components/products/ProductRail";
import { PAGE_URLS } from "@/routes/page-urls";
import { catalogMock } from "@/mocks/services/catalog.mock";
import { fetchSuggestedProducts } from "@/shared/api/methods/products.methods";
import { useCartMetrics } from "@/shared/hooks/use-cart-metrics";
import { useProtectedAction } from "@/shared/hooks/use-protected-action";
import { useCartStore } from "@/shared/store/cart.store";
import type { Product } from "@/shared/types/ecommerce.types";
import { Button, SafeImage } from "@/shared/ui";
import { formatCurrency } from "@/shared/lib/format";

function CartPage() {
  const { goToCheckoutWithAuth } = useProtectedAction();
  const { subtotal, quantity, isEmpty } = useCartMetrics();

  const cartItems = useCartStore((state) => state.cartItems);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateCartQuantity = useCartStore((state) => state.updateCartQuantity);
  const recentlyViewedIds = useCartStore((state) => state.recentlyViewed);

  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<Product[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadSupportProducts = async () => {
      try {
        const [recent, suggested] = await Promise.all([
          catalogMock.getRecentlyViewedProducts(recentlyViewedIds.slice(0, 12)),
          fetchSuggestedProducts(),
        ]);

        if (!isMounted) {
          return;
        }

        setRecentlyViewedProducts(recent);
        setSuggestedProducts(suggested.slice(0, 8));
      } catch {
        if (isMounted) {
          setRecentlyViewedProducts([]);
          setSuggestedProducts([]);
        }
      }
    };

    void loadSupportProducts();

    return () => {
      isMounted = false;
    };
  }, [recentlyViewedIds]);

  if (isEmpty) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid min-h-[360px] place-items-center rounded-[2rem] border border-border bg-card p-8 text-center">
          <div className="max-w-md space-y-3">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-secondary text-primary">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-semibold">Your cart is empty</h1>
            <p className="text-sm text-muted-foreground">
              Explore trending products and add what you love. We keep your selections ready for
              checkout.
            </p>
            <Link
              to={PAGE_URLS.PRODUCTS}
              className="mt-2 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Browse products
            </Link>
          </div>
        </section>

        <ProductRail
          title="Suggested for you"
          subtitle="Popular products from other shoppers"
          products={suggestedProducts}
        />
      </div>
    );
  }

  const shipping = subtotal > 120 ? 0 : 9.99;
  const grandTotal = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold sm:text-3xl lg:text-4xl">Shopping Cart ({quantity})</h1>

          <div className="space-y-3">
            {cartItems.map((item) => (
              <article
                key={item.productId}
                className="rounded-2xl border border-border bg-card p-3 sm:p-4"
              >
                <div className="grid gap-3 sm:gap-4 lg:grid-cols-[126px_minmax(0,1fr)]">
                  <div className="h-[96px] w-[96px] overflow-hidden rounded-xl border border-border bg-secondary sm:h-[120px] sm:w-[120px] lg:h-[126px] lg:w-[126px]">
                    <Link to={PAGE_URLS.PRODUCT_DETAILS.replace(":productId", String(item.productId))}>
                      <SafeImage
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        fallbackTitle="Product image unavailable"
                      />
                    </Link>
                  </div>

                  <div className="min-w-0 space-y-2 lg:space-y-2.5">
                    <p className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-[#f0b429] text-[#f0b429]" />
                      5.0
                    </p>
                    <Link to={PAGE_URLS.PRODUCT_DETAILS.replace(":productId", String(item.productId))}>
                      <h2 className="line-clamp-2 text-base font-semibold leading-tight hover:underline sm:text-lg">
                        {item.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-muted-foreground">{item.brand}</p>

                    <div className="space-y-1 pt-1">
                      <p className="text-xl font-semibold leading-none sm:text-2xl">
                        {formatCurrency(item.discountedPrice)}
                      </p>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm leading-none text-muted-foreground line-through sm:text-base">
                          {formatCurrency(item.price)}
                        </p>
                        <span className="inline-flex rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold leading-none text-white">
                          {Math.max(
                            1,
                            Math.round(
                              ((item.price - item.discountedPrice) / Math.max(item.price, 1)) * 100,
                            ),
                          )}
                          % OFF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/70 pt-3 lg:mt-4">
                  <div className="inline-flex items-center rounded-full border border-border px-1">
                    <button
                      onClick={() =>
                        updateCartQuantity(item.productId, Math.max(1, item.quantity - 1))
                      }
                      className="grid h-9 w-9 place-items-center text-muted-foreground transition hover:text-foreground"
                      aria-label="Decrease quantity"
                      type="button"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        const maxAllowed = item.stock > 0 ? item.stock : item.quantity + 1;
                        updateCartQuantity(item.productId, Math.min(maxAllowed, item.quantity + 1));
                      }}
                      className="grid h-9 w-9 place-items-center text-muted-foreground transition hover:text-foreground"
                      aria-label="Increase quantity"
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-muted-foreground transition hover:text-destructive"
                    aria-label="Remove from cart"
                    type="button"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-border bg-card p-6 shadow-card">
          <h2 className="text-2xl font-semibold">Order Summary</h2>

          <div className="mt-5 rounded-2xl bg-secondary p-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold">
                  {shipping ? formatCurrency(shipping) : "Free"}
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-outline-secondary pt-4">
              <div className="flex items-center justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-semibold">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-border bg-background p-3 text-xs text-muted-foreground">
            Secure checkout with protected payment flow.
          </div>

          <Button className="mt-5 h-11 w-full rounded-xl" onClick={goToCheckoutWithAuth}>
            Continue to checkout
          </Button>
        </aside>
      </section>

      <ProductRail
        title="Recently viewed"
        subtitle="Items you explored earlier"
        products={recentlyViewedProducts}
      />

      <ProductRail
        title="Suggested for you"
        subtitle="Popular cross-category recommendations"
        products={suggestedProducts}
      />
    </div>
  );
}

export default CartPage;
