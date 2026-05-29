import * as React from "react";

import { cn } from "@/shared/lib/utils";

type InputSize = "sm" | "md" | "lg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  hasError?: boolean;
}

const sizeClasses: Record<InputSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = "md", hasError = false, className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "transition-smooth w-full rounded-xl border bg-background outline-none placeholder:text-muted-foreground focus:ring-2",
        hasError ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-ring/30",
        sizeClasses[inputSize],
        className,
      )}
      {...props}
    />
  );
});
