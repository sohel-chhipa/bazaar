import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";
import { Skeleton } from "@/shared/ui";

export function HomePageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[460px] w-full rounded-[2rem]" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="rounded-[2rem] border border-border bg-card p-5 sm:p-7">
        <div className="mb-6 grid gap-3 lg:grid-cols-2">
          <Skeleton className="h-14 w-72" />
          <Skeleton className="h-14 w-full" />
        </div>
        <ProductGridSkeleton count={4} />
      </div>
      <ProductGridSkeleton count={4} />
    </div>
  );
}
