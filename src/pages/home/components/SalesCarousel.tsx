import { useRef } from "react";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";

import type { Sale } from "@/shared/types/catalog.types";

interface SalesCarouselProps {
  sales: Sale[];
}

export function SalesCarousel({ sales }: SalesCarouselProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    listRef.current?.scrollBy({ left: direction * 360, behavior: "smooth" });
  };

  return (
    <section className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Coming up
            </div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Upcoming sales</h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              onClick={() => scroll(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-border transition hover:bg-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll(1)}
              className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-background transition hover:opacity-90"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={listRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4"
        >
          {sales.map((sale) => (
            <article
              key={sale.id}
              className="group relative w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border transition-all duration-300 hover:-translate-y-1 sm:w-[340px]"
            >
              <div className="relative h-[380px] overflow-hidden">
                <img
                  src={sale.image}
                  alt={sale.title}
                  className="h-full w-full object-cover grayscale-[20%] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/20 to-transparent" />
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold text-foreground">
                    {sale.tag}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-background">
                  <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium opacity-90">
                    <Calendar className="h-3.5 w-3.5" /> {sale.date}
                  </div>
                  <h3 className="mb-1 text-xl font-semibold">{sale.title}</h3>
                  <div className="mb-4 text-sm opacity-90">{sale.discount}</div>
                  <button className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-xs font-medium text-foreground transition hover:opacity-90">
                    Notify Me <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
