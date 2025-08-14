"use client";

import React, { ReactNode } from "react";
import { Label } from "@/components/ui/label";
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface FormFieldProps {
  id: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
}

/**
 * A reusable form field component that provides consistent layout and styling
 * for form inputs, including label, description, and error message.
 */
export function FormField({
  id,
  label,
  description,
  error,
  required = false,
  className,
  children,
  labelClassName,
  descriptionClassName,
  errorClassName,
}: FormFieldProps) {
  return (
    <div className={cx("space-y-2", className)}>
      {label && (
        <Label
          htmlFor={id}
          className={cx(
            "block text-sm font-medium",
            "text-gray-700 dark:text-gray-200",
            labelClassName,
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}

      {children}

      {description && (
        <p
          className={cx(
            "text-sm text-gray-500 dark:text-gray-400",
            descriptionClassName,
          )}
        >
          {description}
        </p>
      )}

      {error && (
        <p
          className={cx(
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
}
