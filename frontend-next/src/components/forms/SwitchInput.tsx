"use client";

import React, { forwardRef } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface SwitchInputProps {
  id: string;
  label: string;
  description?: string;
  error?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  switchClassName?: string;
}

/**
 * A reusable switch input component with label and description.
 * Supports error states and custom styling.
 */
export const SwitchInput = forwardRef<HTMLButtonElement, SwitchInputProps>(
  (
    {
      id,
      label,
      description,
      error,
      checked = false,
      onChange,
      disabled = false,
      className,
      labelClassName,
      descriptionClassName,
      errorClassName,
      switchClassName,
    },
    ref,
  ) => {
    const hasError = !!error;

    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label
              htmlFor={id}
              className={cn(
                "text-sm font-medium text-gray-700 dark:text-gray-200",
                disabled && "opacity-60 cursor-not-allowed",
                labelClassName,
              )}
            >
              {label}
            </Label>

            {description && (
              <p
                className={cn(
                  "text-sm text-gray-500 dark:text-gray-400",
                  descriptionClassName,
                )}
              >
                {description}
              </p>
            )}
          </div>

          <Switch
            id={id}
            ref={ref}
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            className={cn(
              hasError &&
                "border-red-500 data-[state=checked]:bg-red-500 dark:border-red-400",
              disabled && "opacity-60 cursor-not-allowed",
              switchClassName,
            )}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${id}-error` : undefined}
          />
        </div>

        {error && (
          <p
            className={cn(
              "text-sm text-red-500 dark:text-red-400",
              errorClassName,
            )}
            id={`${id}-error`}
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

SwitchInput.displayName = "SwitchInput";
