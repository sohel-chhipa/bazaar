import type { ReactNode } from "react";

import { cn } from "@/shared/lib/utils";

type BadgeVariant = "primary" | "neutral" | "success" | "warning";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClassMap: Record<BadgeVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  neutral: "bg-secondary text-foreground",
  success: "bg-emerald-600 text-white",
  warning: "bg-deal text-white",
};

export function Badge({ children, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        variantClassMap[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
