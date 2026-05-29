import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

import { PAGE_URLS } from "@/routes/page-urls";
import { formatCurrency, toSafeNumber } from "@/shared/lib/format";
import { useWishlistStore } from "@/shared/store/wishlist.store";
import type { Product } from "@/shared/types/ecommerce.types";
import { Badge, RatingStars, SafeImage } from "@/shared/ui";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const reviewCount = Math.max(12, Math.round(toSafeNumber(product.rating) * 36));
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isWishlisted = useWishlistStore((state) =>
    state.wishlistItems.some((item) => item.productId === product._id),
  );
  const discountPercent = Math.max(
    0,
    Math.round(((product.price - product.discountedPrice) / Math.max(product.price, 1)) * 100),
  );

  return (
    <article
      className={`group relative h-[420px] overflow-hidden rounded-xl border bg-card transition ${
        isWishlisted ? "border-primary shadow-card ring-1 ring-primary/45" : "border-border"
      }`}
    >
      <button
        type="button"
        onClick={() => toggleWishlist(product)}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full border backdrop-blur-sm transition ${
          isWishlisted
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background/90 text-foreground hover:border-primary/40"
        }`}
      >
        <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
      </button>

      <Link
        to={PAGE_URLS.PRODUCT_DETAILS.replace(":productId", String(product._id))}
        className="flex h-full cursor-pointer flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={`View details for ${product.title}`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <SafeImage
            src={product.image}
            alt={product.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            fallbackTitle="Product image unavailable"
          />
          <div className="absolute left-2 top-2 flex gap-2">
            {product.isNew ? <Badge variant="primary">New</Badge> : null}
            {isWishlisted ? <Badge variant="neutral">Favorited</Badge> : null}
          </div>
          <div className="absolute bottom-2 left-2 rounded bg-background/90 px-2 py-1 text-xs font-semibold text-foreground">
            {toSafeNumber(product.rating).toFixed(1)} ★ | {reviewCount}
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-2 p-3">
          <div className="min-h-[4.2rem]">
            <p className="line-clamp-1 text-sm font-semibold text-foreground">{product.brand}</p>
            <p className="line-clamp-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {product.category}
            </p>
            <h3 className="line-clamp-2 text-base font-medium leading-snug text-muted-foreground">
              {product.title}
            </h3>
          </div>

          <RatingStars rating={toSafeNumber(product.rating)} reviewCount={reviewCount} />

          <div className="mt-auto flex items-end gap-2">
            <p className="text-xl font-semibold">{formatCurrency(product.discountedPrice)}</p>
            <p className="text-sm text-muted-foreground line-through">
              {formatCurrency(product.price)}
            </p>
            <p className="text-sm text-[color:var(--color-deal)]">({discountPercent}% OFF)</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
