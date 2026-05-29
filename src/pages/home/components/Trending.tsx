import { ProductCard } from "@/pages/home/components/ProductCard";
import type { Product } from "@/shared/types/catalog.types";

interface TrendingProps {
  products: Product[];
}

export function Trending({ products }: TrendingProps) {
  return (
    <section id="trending" className="border-b border-border py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Trending now
            </div>
            <h2 className="text-3xl font-semibold sm:text-4xl">What everyone's loving</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
