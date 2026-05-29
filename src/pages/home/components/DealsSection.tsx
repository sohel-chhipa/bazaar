import { CountdownTimer } from "@/pages/home/components/CountdownTimer";
import { ProductCard } from "@/pages/home/components/ProductCard";
import type { Product } from "@/shared/types/catalog.types";

interface DealsSectionProps {
  products: Product[];
}

export function DealsSection({ products }: DealsSectionProps) {
  return (
    <section id="deals" className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 rounded-3xl border border-border bg-subtle p-6 sm:p-10 md:flex-row md:items-center">
          <div>
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Limited Time
            </div>
            <h2 className="text-3xl font-semibold sm:text-4xl">Today's deals</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Hand-picked products at their lowest prices for the next few hours.
            </p>
          </div>
          <CountdownTimer />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
