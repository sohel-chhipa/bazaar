import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { formatCurrency, toSafeNumber } from "@/shared/lib/format";
import type { Product } from "@/shared/types/ecommerce.types";
import { SafeImage } from "@/shared/ui";

interface HomeDealsCarouselProps {
  products: Product[];
}

const toProductUrl = (productId: number) =>
  PAGE_URLS.PRODUCT_DETAILS.replace(":productId", String(productId));

export function HomeDealsCarousel({ products }: HomeDealsCarouselProps) {
  const slides = useMemo(() => products.slice(0, 6), [products]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [slides.length]);

  if (!slides.length) {
    return null;
  }

  const currentSlide = slides[activeIndex % slides.length];
  if (!currentSlide) {
    return null;
  }

  const safePrice = Math.max(1, toSafeNumber(currentSlide.price, 1));
  const safeDiscountedPrice = toSafeNumber(currentSlide.discountedPrice);
  const supportingSlides = slides.filter((_, index) => index !== activeIndex).slice(0, 2);

  return (
    <section className="space-y-4">
      <article className="relative overflow-hidden rounded-[2rem] border border-border bg-card">
        <SafeImage
          src={currentSlide.image}
          alt={currentSlide.title}
          className="absolute inset-0 h-full w-full object-cover"
          wrapperClassName="absolute inset-0 rounded-none"
          fallbackTitle="Deal image unavailable"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/52 to-black/24" />

        <div className="relative flex min-h-[430px] flex-col justify-between p-6 sm:p-8 lg:min-h-[500px] lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground">
              Limited Deal
            </span>
            <span className="rounded-full border border-white/40 bg-white/12 px-3 py-1 text-xs font-semibold text-white">
              Save up to {Math.max(5, Math.round((1 - safeDiscountedPrice / safePrice) * 100))}%
            </span>
          </div>

          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-white/80">
              {currentSlide.category}
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {currentSlide.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
              Grab this trending pick before stock runs out. High-rated by shoppers and curated for
              quick checkout.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to={toProductUrl(currentSlide._id)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Explore Product
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white">
                {formatCurrency(safeDiscountedPrice)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide._id}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-white" : "w-2 bg-white/45"
                  }`}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                aria-label="Previous slide"
                onClick={() =>
                  setActiveIndex((current) => (current - 1 + slides.length) % slides.length)
                }
                className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/10 text-white transition hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                aria-label="Next slide"
                onClick={() => setActiveIndex((current) => (current + 1) % slides.length)}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-white/10 text-white transition hover:bg-white/20"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </article>

      <div className="grid gap-4 md:grid-cols-2">
        {supportingSlides.map((product) => (
          <article
            key={product._id}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card"
          >
            <SafeImage
              src={product.image}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              wrapperClassName="absolute inset-0 rounded-none"
              fallbackTitle="Deal image unavailable"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/42 to-black/24" />

            <div className="relative flex min-h-[168px] flex-col justify-between p-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
                  {product.brand}
                </p>
                <h3 className="mt-2 max-w-[82%] text-2xl font-semibold leading-tight">
                  {product.title}
                </h3>
              </div>
              <Link
                className="inline-flex w-fit rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
                to={toProductUrl(product._id)}
              >
                Shop now
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
