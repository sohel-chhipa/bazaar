import { ArrowRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

import { BrandCarousel } from "@/pages/home/components/BrandCarousel";
import { EditorialCollectionSection } from "@/pages/home/components/EditorialCollectionSection";
import { HomeDealsCarousel } from "@/pages/home/components/HomeDealsCarousel";
import { HomePageSkeleton } from "@/pages/home/components/HomePageSkeleton";
import { ProductRail } from "@/components/products/ProductRail";
import { PAGE_URLS } from "@/routes/page-urls";
import { useApiError } from "@/shared/hooks/use-api-error";
import { useCartStore } from "@/shared/store/cart.store";
import { useHomeStore } from "@/shared/store/home.store";

function HomePage() {
  const { onApiError } = useApiError();
  const recentlyViewed = useCartStore((state) => state.recentlyViewed);
  const heroProducts = useHomeStore((state) => state.heroProducts);
  const collectionProducts = useHomeStore((state) => state.collectionProducts);
  const suggestedProducts = useHomeStore((state) => state.suggestedProducts);
  const recentlyViewedProducts = useHomeStore((state) => state.recentlyViewedProducts);
  const isLoading = useHomeStore((state) => state.isLoading);
  const loadHomeData = useHomeStore((state) => state.loadHomeData);
  const loadRecentlyViewed = useHomeStore((state) => state.loadRecentlyViewed);

  useEffect(() => {
    loadHomeData().catch((error) => {
      onApiError(error, {
        title: "Home unavailable",
        message: "We could not load featured products right now.",
      });
    });
  }, [loadHomeData, onApiError]);

  useEffect(() => {
    void loadRecentlyViewed(recentlyViewed);
  }, [loadRecentlyViewed, recentlyViewed]);

  const brands = useMemo(() => {
    const byBrand = new Set<string>();
    collectionProducts.forEach((item) => byBrand.add(item.brand.toUpperCase()));
    return Array.from(byBrand).slice(0, 12);
  }, [collectionProducts]);

  if (isLoading) {
    return (
      <div className="ruler-layout">
        <div className="ruler-frame">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            <HomePageSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ruler-layout">
      <div className="ruler-frame">
        <section className="ruler-section px-4 py-6 sm:px-6 lg:px-8">
          <HomeDealsCarousel products={heroProducts} />
        </section>

        <section className="ruler-section px-4 py-4 sm:px-6 lg:px-8">
          <BrandCarousel brands={brands} />
        </section>

        <section className="ruler-section px-4 py-8 sm:px-6 lg:px-8">
          <EditorialCollectionSection products={collectionProducts} />
        </section>

        <section className="ruler-section px-4 py-8 sm:px-6 lg:px-8">
          <section className="space-y-5 rounded-[2rem] border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Browse the full catalog</h2>
                <p className="text-sm text-muted-foreground">
                  Find products by category, pricing, and ratings in one place.
                </p>
              </div>
              <Link
                to={PAGE_URLS.PRODUCTS}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                Explore all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </section>

        <section className="ruler-section px-4 py-8 sm:px-6 lg:px-8">
          <ProductRail
            title="Suggested for you"
            subtitle="Smart picks from marketplace inventory"
            products={suggestedProducts}
          />
        </section>

        <section className="ruler-section px-4 py-8 sm:px-6 lg:px-8">
          <ProductRail
            title="Recently viewed"
            subtitle="Continue where you left off"
            products={recentlyViewedProducts}
          />
        </section>
      </div>
    </div>
  );
}

export default HomePage;
