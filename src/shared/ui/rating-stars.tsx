import { Star } from "lucide-react";

import { toSafeNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/utils";

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  className?: string;
  sizeClassName?: string;
}

export function RatingStars({
  rating,
  reviewCount,
  className,
  sizeClassName = "h-3.5 w-3.5",
}: RatingStarsProps) {
  const safeRating = Math.max(0, Math.min(5, toSafeNumber(rating)));
  const filledStars = Math.round(safeRating);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <div className="inline-flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={`rating-star-${index}`}
            className={cn(
              sizeClassName,
              index < filledStars ? "fill-primary text-primary" : "text-border",
            )}
          />
        ))}
      </div>
      {typeof reviewCount === "number" ? (
        <span className="text-xs text-muted-foreground">({reviewCount} reviews)</span>
      ) : null}
    </div>
  );
}
