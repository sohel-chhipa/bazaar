import type { ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";

import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

interface BaseFormFieldProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label?: string;
  description?: string;
  className?: string;
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>;
}

interface InputFormFieldProps<TFieldValues extends FieldValues> extends BaseFormFieldProps<TFieldValues> {
  type?: "input";
  inputProps?: React.ComponentProps<typeof Input>;
}

interface TextareaFormFieldProps<TFieldValues extends FieldValues>
  extends BaseFormFieldProps<TFieldValues> {
  type: "textarea";
  textareaProps?: React.ComponentProps<typeof Textarea>;
}

interface SelectFormFieldProps<TFieldValues extends FieldValues> extends BaseFormFieldProps<TFieldValues> {
  type: "select";
  options: { label: string; value: string }[];
  placeholder?: string;
  selectProps?: Omit<React.ComponentProps<typeof Select>, "options" | "value" | "onChange">;
}

type FormFieldProps<TFieldValues extends FieldValues> =
  | InputFormFieldProps<TFieldValues>
  | TextareaFormFieldProps<TFieldValues>
  | SelectFormFieldProps<TFieldValues>;

export function FormField<TFieldValues extends FieldValues>(props: FormFieldProps<TFieldValues>) {
  const { control, name, label, description, className, rules } = props;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const hasError = Boolean(fieldState.error);
        let fieldControl: ReactNode = null;

        if (props.type === "textarea") {
          fieldControl = (
            <Textarea
              {...field}
              {...props.textareaProps}
              hasError={hasError}
              className={cn(props.textareaProps?.className)}
            />
          );
        } else if (props.type === "select") {
          fieldControl = (
            <Select
              {...props.selectProps}
              options={props.options}
              placeholder={props.placeholder}
              value={field.value ?? ""}
              onChange={(event) => field.onChange(event.target.value)}
            />
          );
        } else {
          const { onChange: inputOnChange, ...restInputProps } = props.inputProps ?? {};

          fieldControl = (
            <Input
              {...field}
              {...restInputProps}
              hasError={hasError}
              className={cn(restInputProps.className)}
              onChange={(event) => {
                if (inputOnChange) {
                  inputOnChange(event);
                  return;
                }
                field.onChange(event);
              }}
            />
          );
        }

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            {label ? (
              <Label htmlFor={String(name)} className="normal-case tracking-normal text-foreground">
                {label}
              </Label>
            ) : null}
            {fieldControl}
            {description && !hasError ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
            {hasError ? (
              <p className="text-xs text-destructive">{fieldState.error?.message}</p>
            ) : null}
          </div>
        );
      }}
    />
  );
}
