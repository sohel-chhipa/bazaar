import type { TextareaHTMLAttributes } from "react";

import { cn } from "@/shared/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export function Textarea({ hasError = false, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "transition-smooth w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2",
        hasError
          ? "border-destructive focus:ring-destructive/30"
          : "border-input focus:ring-ring/30",
        className,
      )}
      {...props}
    />
  );
}
