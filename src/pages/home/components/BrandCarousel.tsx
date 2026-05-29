interface BrandCarouselProps {
  brands: string[];
}

export function BrandCarousel({ brands }: BrandCarouselProps) {
  if (!brands.length) {
    return null;
  }

  const track = [...brands, ...brands];

  return (
    <section className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-5">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Trusted by top brands worldwide
      </div>
      <div className="overflow-hidden">
        <div className="flex w-max items-center gap-8 animate-brand-marquee sm:gap-10">
          {track.map((brand, index) => (
            <span
              key={`${brand}-${index}`}
              className="shrink-0 text-sm font-semibold uppercase tracking-[0.2em] text-foreground/80"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
