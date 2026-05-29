import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { Brand, HeroDealSlide } from "@/shared/types/catalog.types";

interface HeroProps {
  deals: HeroDealSlide[];
  brands: Brand[];
}

export function Hero({ deals, brands }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (deals.length <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % deals.length);
    }, 4800);

    return () => window.clearInterval(intervalId);
  }, [deals.length]);

  const safeActiveIndex = deals.length ? activeIndex % deals.length : 0;
  const activeDeal = deals[safeActiveIndex];

  const promoCards = useMemo(() => {
    if (!deals.length) {
      return [];
    }

    return [
      deals[(safeActiveIndex + 1) % deals.length],
      deals[(safeActiveIndex + 2) % deals.length],
    ].filter((deal): deal is HeroDealSlide => Boolean(deal));
  }, [deals, safeActiveIndex]);

  const brandTrack = useMemo(() => [...brands, ...brands], [brands]);

  if (!activeDeal) {
    return null;
  }

  const goToPrevious = () => {
    setActiveIndex((current) => (current - 1 + deals.length) % deals.length);
  };

  const goToNext = () => {
    setActiveIndex((current) => (current + 1) % deals.length);
  };

  return (
    <section className="border-b border-border py-8 sm:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <article className="relative overflow-hidden rounded-[2rem] border border-border bg-card text-background shadow-soft">
          <img
            key={activeDeal.id}
            src={activeDeal.image}
            alt={activeDeal.title}
            className="absolute inset-0 h-full w-full object-cover animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/52 to-black/28" />

          <div className="relative flex min-h-[430px] flex-col justify-between p-6 sm:p-8 lg:min-h-[470px] lg:p-10">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex items-center rounded-full border border-white/35 bg-primary px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground">
                {activeDeal.badge}
              </div>
              <div className="inline-flex items-center rounded-full border border-white/35 bg-white/12 px-3 py-1 text-xs font-semibold text-white">
                {activeDeal.discountLabel}
              </div>
            </div>

            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                {activeDeal.title}
              </h1>
              <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
                {activeDeal.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href={activeDeal.href}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.01] hover:opacity-95"
                >
                  {activeDeal.ctaLabel}
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#deals"
                  className="inline-flex items-center rounded-full border border-white/50 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
                >
                  View all active deals
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {deals.map((deal, index) => (
                  <button
                    key={deal.id}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === safeActiveIndex ? "w-8 bg-white" : "w-2 bg-white/45"
                    }`}
                    aria-label={`Show deal ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevious}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                  aria-label="Previous deal"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={goToNext}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-white/10 text-white backdrop-blur transition hover:bg-white/20"
                  aria-label="Next deal"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {promoCards.map((deal) => (
            <article
              key={`promo-${deal.id}`}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card"
            >
              <img
                src={deal.image}
                alt={deal.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/42 to-black/20" />

              <div className="relative flex min-h-[160px] flex-col justify-between p-5 text-white">
                <div className="max-w-[70%]">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                    {deal.discountLabel}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold leading-tight text-white">
                    {deal.title}
                  </h3>
                </div>
                <a
                  href={deal.href}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  Shop now
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Trusted by leading brands worldwide
          </div>
          <div className="overflow-hidden">
            <div className="flex w-max items-center gap-8 animate-brand-marquee sm:gap-10">
              {brandTrack.map((brand, index) => (
                <span
                  key={`${brand.id}-${index}`}
                  className="shrink-0 text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  {brand.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
