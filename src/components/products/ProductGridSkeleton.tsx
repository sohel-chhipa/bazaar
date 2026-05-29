import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";

interface ProductGridSkeletonProps {
  count?: number;
  strictCount?: boolean;
}

export function ProductGridSkeleton({ count = 8, strictCount = false }: ProductGridSkeletonProps) {
  const visibleViewportSafeCount = strictCount ? count : Math.max(count, 12);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: visibleViewportSafeCount }).map((_, index) => (
        <ProductCardSkeleton key={`product-skeleton-${index}`} />
      ))}
    </div>
  );
}
