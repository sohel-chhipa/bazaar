import { ClipboardList, Heart, House, ShoppingBag, Store } from "lucide-react";
import type { MouseEvent } from "react";
import { NavLink, useLocation } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { useProtectedAction } from "@/shared/hooks/use-protected-action";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/auth.store";
import { useCartStore } from "@/shared/store/cart.store";
import { useWishlistStore } from "@/shared/store/wishlist.store";

type BottomBarItem = {
  to: string;
  label: string;
  icon: typeof House;
  requiresAuth?: boolean;
  count?: number;
  matchPath: (pathname: string) => boolean;
};

const baseItems: BottomBarItem[] = [
  {
    to: PAGE_URLS.HOME,
    label: "Home",
    icon: House,
    matchPath: (pathname) => pathname === PAGE_URLS.HOME,
  },
  {
    to: PAGE_URLS.PRODUCTS,
    label: "Shop",
    icon: Store,
    matchPath: (pathname) => pathname.startsWith(PAGE_URLS.PRODUCTS),
  },
  {
    to: PAGE_URLS.WISHLIST,
    label: "Favo",
    icon: Heart,
    matchPath: (pathname) => pathname.startsWith(PAGE_URLS.WISHLIST),
  },
  {
    to: PAGE_URLS.CART,
    label: "Cart",
    icon: ShoppingBag,
    matchPath: (pathname) =>
      pathname.startsWith(PAGE_URLS.CART) ||
      pathname.startsWith(PAGE_URLS.CHECKOUT) ||
      pathname.startsWith(PAGE_URLS.PAYMENT_OTP),
  },
  {
    to: PAGE_URLS.MY_ORDERS,
    label: "Orders",
    icon: ClipboardList,
    requiresAuth: true,
    matchPath: (pathname) => pathname.startsWith("/my-orders"),
  },
];

export function MobileBottomBar() {
  const { goToRouteWithAuth } = useProtectedAction();
  const { pathname } = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const cartCount = useCartStore((state) =>
    state.cartItems.reduce((total, item) => total + item.quantity, 0),
  );
  const wishlistCount = useWishlistStore((state) => state.wishlistItems.length);

  const items = baseItems.map((item) => {
    if (item.to === PAGE_URLS.CART) {
      return { ...item, count: cartCount };
    }

    if (item.to === PAGE_URLS.WISHLIST) {
      return { ...item, count: wishlistCount };
    }

    return item;
  });

  const handleItemClick = (event: MouseEvent<HTMLAnchorElement>, item: BottomBarItem) => {
    if (!item.requiresAuth || isAuthenticated) {
      return;
    }

    event.preventDefault();
    goToRouteWithAuth(item.to, "Login to view your orders");
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 lg:hidden">
      <nav
        className="mx-auto flex w-full max-w-md items-center justify-between rounded-full border border-border bg-card p-1.5 shadow-[0_-8px_30px_rgba(15,23,42,0.08)]"
        style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
      >
        {items.map((item) => {
          const Icon = item.icon;
          const selected = item.matchPath(pathname);

          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(event) => handleItemClick(event, item)}
              className={cn(
                "relative flex h-11 min-w-[52px] items-center justify-center rounded-full px-3 text-muted-foreground transition",
                selected && item.to !== PAGE_URLS.WISHLIST && "bg-primary text-primary-foreground",
              )}
              aria-label={item.label}
            >
              <span
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full transition",
                  item.to === PAGE_URLS.WISHLIST
                    ? selected
                      ? "bg-primary text-primary-foreground"
                      : "text-primary"
                    : "",
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4",
                    selected && item.to === PAGE_URLS.WISHLIST && "fill-current",
                  )}
                />
              </span>
              <span
                className={cn(
                  "ml-1 text-xs font-semibold",
                  item.to === PAGE_URLS.WISHLIST ? "hidden" : selected ? "inline" : "hidden",
                )}
              >
                {item.label}
              </span>
              {(item.count ?? 0) > 0 ? (
                <span
                  className={cn(
                    "absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold",
                    selected ? "bg-background text-foreground" : "bg-primary text-primary-foreground",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
