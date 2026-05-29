import { Link } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { formatCurrency, toSafeNumber } from "@/shared/lib/format";
import type { Product } from "@/shared/types/ecommerce.types";
import { RatingStars, SafeImage } from "@/shared/ui";

interface EditorialCollectionSectionProps {
  products: Product[];
}

const toProductUrl = (productId: number) =>
  PAGE_URLS.PRODUCT_DETAILS.replace(":productId", String(productId));

export function EditorialCollectionSection({ products }: EditorialCollectionSectionProps) {
  const cards = products.slice(0, 10);

  if (!cards.length) {
    return null;
  }

  return (
    <section className="space-y-10 rounded-[2rem] border border-border bg-card p-5 sm:p-7 lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
        <h2 className="max-w-md text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
          Explore Our Latest Collection
        </h2>
        <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Discover premium picks crafted for everyday style and high conversion. Each product in
          this section is curated for quality visuals, better ratings, and purchase confidence.
        </p>
      </div>

      <div className="no-scrollbar -mx-2 flex gap-4 overflow-x-auto px-2 pb-2">
        {cards.map((product) => (
          <article key={product._id} className="w-[270px] shrink-0">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-muted p-4">
              <span className="absolute left-4 top-4 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                New
              </span>
              <Link to={toProductUrl(product._id)} className="block">
                <div className="h-[230px] overflow-hidden rounded-2xl border border-border/50 bg-card">
                  <SafeImage
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    fallbackTitle="Product image unavailable"
                  />
                </div>
              </Link>
            </div>

            <div className="flex min-h-[134px] flex-col px-1 pt-4">
              <h3 className="line-clamp-2 min-h-[3.4rem] text-xl font-semibold leading-snug text-foreground">
                {product.title}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {formatCurrency(product.discountedPrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <RatingStars
                rating={toSafeNumber(product.rating)}
                reviewCount={Math.max(20, Math.round(toSafeNumber(product.rating) * 43))}
                className="mt-2"
              />
            </div>
          </article>
        ))}
      </div>

      <p className="mx-auto max-w-5xl text-center text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
        We craft amazing products that delight customers and continually improve modern everyday
        shopping.
      </p>
    </section>
  );
}
