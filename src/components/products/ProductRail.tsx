import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/shared/types/ecommerce.types";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function ProductRail({ title, subtitle, products }: ProductRailProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 pt-1">
        {products.map((product) => (
          <div key={product._id} className="h-full w-[290px] shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
