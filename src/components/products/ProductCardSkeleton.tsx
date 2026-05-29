import { Skeleton } from "@/shared/ui";

export function ProductCardSkeleton() {
  return (
    <div className="h-[420px] overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex h-full flex-col">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <Skeleton className="h-full w-full rounded-none" />
        </div>

        <div className="flex flex-1 flex-col space-y-2 p-3">
          <div className="min-h-[4.2rem] space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <Skeleton className="h-4 w-32" />

          <div className="mt-auto flex items-end gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
