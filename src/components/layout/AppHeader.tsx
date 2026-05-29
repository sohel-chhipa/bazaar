import { Heart, LogOut, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

import { ProductSearchModal } from "@/components/layout/ProductSearchModal";
import { PAGE_URLS } from "@/routes/page-urls";
import { useProtectedAction } from "@/shared/hooks/use-protected-action";
import { cn } from "@/shared/lib/utils";
import { useAuthStore } from "@/shared/store/auth.store";
import { useCartStore } from "@/shared/store/cart.store";
import { useUiStore } from "@/shared/store/ui.store";
import { useWishlistStore } from "@/shared/store/wishlist.store";
import { Button } from "@/shared/ui";

const navLinks = [
  { to: PAGE_URLS.HOME, label: "Home" },
  { to: PAGE_URLS.PRODUCTS, label: "Shop" },
  { to: PAGE_URLS.WISHLIST, label: "Wishlist" },
  { to: PAGE_URLS.CART, label: "Cart" },
  { to: PAGE_URLS.MY_ORDERS, label: "My Orders", requiresAuth: true },
];

export function AppHeader() {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { goToRouteWithAuth } = useProtectedAction();

  const cartItems = useCartStore((state) => state.cartItems);
  const wishlistCount = useWishlistStore((state) => state.wishlistItems.length);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const openAuthModal = useUiStore((state) => state.openAuthModal);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isHomePage = location.pathname === PAGE_URLS.HOME;

  useEffect(() => {
    if (!isHomePage) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHomePage]);

  const handleNavClick = (
    event: MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[number],
  ) => {
    if (!link.requiresAuth || isAuthenticated) {
      return;
    }

    event.preventDefault();
    goToRouteWithAuth(link.to, "Login to view your orders");
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-border ${
          isHomePage
            ? isScrolled
              ? "home-gradient-header backdrop-blur-sm"
              : "bg-transparent"
            : "bg-card/95 backdrop-blur-sm"
        }`}
      >
        <div className="relative mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link to={PAGE_URLS.HOME} className="inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-primary bg-primary font-bold text-primary-foreground">
              B
            </div>
            <span className="text-xl font-semibold tracking-tight">Bazaar</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={(event) => handleNavClick(event, item)}
                className={({ isActive }) =>
                  cn(
                    "relative py-2 text-sm font-medium transition",
                    isActive
                      ? "text-foreground after:absolute after:bottom-0 after:left-1/2 after:h-[2px] after:w-[30%] after:-translate-x-1/2 after:rounded-full after:bg-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search products"
              className="grid h-10 w-10 place-items-center rounded-xl border border-primary text-primary transition hover:bg-secondary"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              to={PAGE_URLS.WISHLIST}
              aria-label="Go to wishlist"
              className="relative hidden h-10 w-10 place-items-center rounded-xl border border-primary text-primary transition hover:bg-secondary lg:grid"
            >
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>

            <Link
              to={PAGE_URLS.CART}
              aria-label="Go to cart"
              className="relative hidden h-10 w-10 place-items-center rounded-xl border border-primary text-primary transition hover:bg-secondary lg:grid"
            >
              <ShoppingBag className="h-4 w-4" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>

            {isAuthenticated ? (
              <Button
                size="sm"
                variant="outline"
                className="inline-flex gap-1.5 border-primary bg-primary text-primary-foreground hover:bg-[#583d29] hover:text-primary-foreground"
                leftIcon={<LogOut className="h-3.5 w-3.5" />}
                onClick={() => logout()}
              >
                Logout
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="inline-flex border-primary bg-primary text-primary-foreground hover:bg-[#583d29] hover:text-primary-foreground"
                onClick={() => openAuthModal("Login to continue shopping")}
                aria-label="Sign in"
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      <ProductSearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
