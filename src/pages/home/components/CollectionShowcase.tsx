import { Heart, Star } from "lucide-react";

import { toSafeNumber } from "@/shared/lib/format";
import type { Product } from "@/shared/types/catalog.types";

interface CollectionShowcaseProps {
  products: Product[];
}

export function CollectionShowcase({ products }: CollectionShowcaseProps) {
  const collection = products.slice(0, 8);
  const statementVisuals = collection.slice(0, 3);

  return (
    <section id="deals" className="border-b border-border bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <h2 className="max-w-lg text-4xl font-semibold leading-[1.02] tracking-tight sm:text-5xl">
            Explore Our Latest Collection
          </h2>
          <p className="max-w-xl pt-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Discover our newest range of curated pieces designed to elevate your daily style. From
            statement essentials to timeless staples, every pick is selected for impact, comfort,
            and value.
          </p>
        </div>

        <div className="no-scrollbar mt-10 -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
          {collection.map((product) => (
            <article key={product.id} className="w-[258px] shrink-0">
              <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-secondary p-4">
                <span className="absolute left-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
                  New
                </span>
                <button
                  className="absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-primary/75"
                  aria-label={`Save ${product.title}`}
                >
                  <Heart className="h-3.5 w-3.5" />
                </button>
                <div className="grid h-[220px] place-items-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-[170px] w-full object-contain"
                  />
                </div>
              </div>

              <div className="px-1 pt-4">
                <h3 className="line-clamp-2 text-xl font-medium leading-snug">{product.title}</h3>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    ${toSafeNumber(product.price).toFixed(2)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />(
                    {(toSafeNumber(product.rating) * 12).toFixed(0)} Reviews)
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-5xl text-center text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          <span>We craft amazing products that</span>
          {statementVisuals[0] ? (
            <span className="mx-2 inline-flex h-12 w-16 translate-y-1 overflow-hidden rounded-xl border border-border align-middle sm:h-16 sm:w-20">
              <img
                src={statementVisuals[0].image}
                alt={statementVisuals[0].category}
                className="h-full w-full object-cover"
              />
            </span>
          ) : null}
          <span>delight customers and continually enhance</span>
          {statementVisuals[1] ? (
            <span className="mx-2 inline-flex h-12 w-16 translate-y-1 overflow-hidden rounded-xl border border-border align-middle sm:h-16 sm:w-20">
              <img
                src={statementVisuals[1].image}
                alt={statementVisuals[1].category}
                className="h-full w-full object-cover"
              />
            </span>
          ) : null}
          <span>modern everyday style</span>
          {statementVisuals[2] ? (
            <span className="mx-2 inline-flex h-12 w-16 translate-y-1 overflow-hidden rounded-xl border border-border align-middle sm:h-16 sm:w-20">
              <img
                src={statementVisuals[2].image}
                alt={statementVisuals[2].category}
                className="h-full w-full object-cover"
              />
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
