import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/shared/lib/utils";
import { composeVariants } from "@/shared/lib/variant";
import { Spinner } from "@/shared/ui/spinner";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
}

const buttonVariants = {
  variant: {
    primary: "bg-primary text-primary-foreground hover:opacity-90 focus-visible:ring-primary/40",
    secondary: "bg-secondary text-foreground hover:bg-accent focus-visible:ring-primary/30",
    outline:
      "border border-border bg-background text-foreground hover:bg-secondary focus-visible:ring-primary/30",
    ghost: "bg-transparent text-foreground hover:bg-secondary focus-visible:ring-primary/20",
    destructive:
      "bg-destructive text-destructive-foreground hover:opacity-90 focus-visible:ring-destructive/30",
  },
  size: {
    sm: "h-9 rounded-lg px-3 text-xs",
    md: "h-10 rounded-xl px-4 text-sm",
    lg: "h-12 rounded-xl px-5 text-sm",
  },
} as const;

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  type = "button",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : type}
      disabled={disabled || isLoading}
      className={cn(
        "transition-smooth inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        composeVariants(buttonVariants, { variant, size }),
        className,
      )}
      {...props}
    >
      {isLoading ? <Spinner className="h-3.5 w-3.5" /> : leftIcon}
      <span>{children}</span>
      {!isLoading ? rightIcon : null}
    </Comp>
  );
}
