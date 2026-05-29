import { ImageOff } from "lucide-react";
import { useEffect, useMemo, useState, type ImgHTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string | null;
  wrapperClassName?: string;
  fallbackTitle?: string;
}

export function SafeImage({
  src,
  alt,
  className,
  wrapperClassName,
  fallbackTitle = "Image unavailable",
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);

    if (!src) {
      return;
    }

    const preloadImage = new Image();
    preloadImage.src = src;

    if (preloadImage.complete) {
      setIsLoaded(true);
    }
  }, [src]);

  const shouldShowImage = useMemo(() => Boolean(src) && !hasError, [hasError, src]);

  if (!shouldShowImage) {
    return (
      <div
        className={cn(
          "grid h-full w-full place-items-center rounded-xl border border-border bg-muted/70",
          wrapperClassName,
        )}
        role="img"
        aria-label={alt ?? fallbackTitle}
      >
        <div className="flex flex-col items-center gap-1.5 text-center text-muted-foreground">
          <ImageOff className="h-5 w-5" />
          <span className="text-xs font-medium">{fallbackTitle}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full overflow-hidden", wrapperClassName)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary via-muted to-secondary transition-opacity duration-300",
          isLoaded ? "opacity-0" : "opacity-100",
        )}
      />
      <img
        src={src ?? undefined}
        alt={alt}
        className={cn("h-full w-full", className)}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        loading={props.loading ?? "lazy"}
        {...props}
      />
    </div>
  );
}
