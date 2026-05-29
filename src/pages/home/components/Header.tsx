import { useEffect, useMemo, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { NAVIGATION_LINKS, SITE_META } from "@/shared/constants/site.constants";
import { useAppStore } from "@/shared/store/app.store";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const searchQuery = useAppStore((state) => state.searchQuery);
  const cartCount = useAppStore((state) => state.cartCount);
  const mobileMenuOpen = useAppStore((state) => state.mobileMenuOpen);
  const setSearchQuery = useAppStore((state) => state.setSearchQuery);
  const toggleMobileMenu = useAppStore((state) => state.toggleMobileMenu);
  const closeMobileMenu = useAppStore((state) => state.closeMobileMenu);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartCountLabel = useMemo(() => cartCount.toString(), [cartCount]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass shadow-card" : "border-b border-transparent bg-background"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <a href="#" className="flex shrink-0 items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-bold text-primary-foreground">
              Z
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              {SITE_META.appName}
            </span>
          </a>

          <div className="mx-4 hidden max-w-xl flex-1 md:flex">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/75" />
              <input
                type="text"
                value={searchQuery}
                placeholder="Search products"
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full rounded-full border border-border bg-background py-2.5 pl-11 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-primary transition hover:bg-primary/10">
              <ShoppingBag className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {cartCountLabel}
              </span>
            </button>
            <button className="hidden h-10 w-10 place-items-center rounded-full border border-border bg-background text-primary transition hover:bg-primary/10 sm:grid">
              <User className="h-4 w-4" />
            </button>
            <button
              onClick={toggleMobileMenu}
              className="grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-primary lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="animate-fade-in pb-4 lg:hidden">
            <div className="relative mb-3 md:hidden">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/75" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products"
                className="w-full rounded-full border border-border bg-background py-2.5 pl-11 pr-4 text-sm outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              {NAVIGATION_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-2xl px-4 py-3 font-medium hover:bg-primary/10"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
