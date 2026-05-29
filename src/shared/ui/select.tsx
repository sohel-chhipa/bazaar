import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/shared/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  selectSize?: "sm" | "md" | "lg";
  value?: string;
  onChange?: (event: { target: { value: string } }) => void;
  disabled?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base",
} as const;

export function Select({
  options,
  placeholder,
  selectSize = "md",
  value,
  onChange,
  disabled,
  className,
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      value={value}
      disabled={disabled}
      onValueChange={(nextValue) => onChange?.({ target: { value: nextValue } })}
    >
      <SelectPrimitive.Trigger
        className={cn(
          "transition-smooth inline-flex w-full appearance-none items-center justify-between rounded-xl border border-input bg-background shadow-none outline-none ring-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 data-[placeholder]:text-muted-foreground",
          sizeClasses[selectSize],
          className,
        )}
        aria-label={placeholder ?? "Select option"}
      >
        <SelectPrimitive.Value placeholder={placeholder ?? "Select option"} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={8}
          className="z-[120] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-input bg-card shadow-soft"
        >
          <SelectPrimitive.Viewport className="max-h-64 p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className="transition-smooth relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-3 text-sm text-foreground outline-none focus:bg-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                  <Check className="h-4 w-4 text-primary" />
                </SelectPrimitive.ItemIndicator>
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
