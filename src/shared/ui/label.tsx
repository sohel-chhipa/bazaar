import * as LabelPrimitive from "@radix-ui/react-label";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/lib/utils";

type LabelProps = ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      className={cn("text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground", className)}
      {...props}
    />
  );
}
