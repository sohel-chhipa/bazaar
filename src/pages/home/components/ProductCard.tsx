import { Eye, Heart, ShoppingBag, Star } from "lucide-react";

import { useAppStore } from "@/shared/store/app.store";
import type { Product } from "@/shared/types/catalog.types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAppStore((state) => state.addToCart);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-foreground">
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <img
          src={product.image}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-1 text-[10px] font-semibold text-background">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-semibold">
            -{discount}%
          </span>
        )}
        <button className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-background transition hover:bg-foreground hover:text-background">
          <Heart className="h-4 w-4" />
        </button>
        <button className="absolute bottom-3 left-3 inline-flex h-9 translate-y-2 items-center gap-1.5 rounded-full border border-border bg-background px-3 text-xs font-medium opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Eye className="h-3.5 w-3.5" /> Quick view
        </button>
      </div>

      <div className="p-4">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.category}
        </div>
        <h3 className="line-clamp-1 font-medium leading-tight">{product.title}</h3>
        <div className="mt-1.5 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-foreground" />
          <span className="text-xs font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">(2.1k)</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-lg font-semibold">${product.price}</div>
            {product.originalPrice ? (
              <div className="text-xs text-muted-foreground line-through">
                ${product.originalPrice}
              </div>
            ) : null}
          </div>
          <button
            onClick={() => addToCart()}
            className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background transition-transform hover:scale-105"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
