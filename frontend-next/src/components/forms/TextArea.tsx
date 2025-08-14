"use client";

import React, { forwardRef, TextareaHTMLAttributes } from "react";
import { FormField, FormFieldProps } from "./FormField";
import { Textarea } from "@/components/ui/textarea";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface TextAreaProps
  extends Omit<FormFieldProps, "children">,
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> {
  textareaClassName?: string;
  rows?: number;
  maxLength?: number;
  showCharacterCount?: boolean;
}

/**
 * A reusable textarea component that combines FormField with a Textarea.
 * Supports character counting and validation.
 */
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      id,
      label,
      description,
      error,
      required = false,
      className,
      textareaClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      rows = 4,
      maxLength,
      showCharacterCount = false,
      disabled,
      value = "",
      ...props
    },
    ref,
  ) => {
    const hasError = !!error;
    const characterCount = typeof value === "string" ? value.length : 0;
    const isNearLimit = maxLength && characterCount >= maxLength * 0.9;
    const isAtLimit = maxLength && characterCount >= maxLength;

    return (
      <FormField
        id={id}
        label={label}
        description={description}
        error={error}
        required={required}
        className={className}
        labelClassName={labelClassName}
        descriptionClassName={descriptionClassName}
        errorClassName={errorClassName}
      >
        <div className="space-y-1">
          <Textarea
            id={id}
            ref={ref}
            rows={rows}
            maxLength={maxLength}
            aria-invalid={hasError ? "true" : "false"}
            aria-describedby={hasError ? `${id}-error` : undefined}
            className={cx(
              "resize-y",
              hasError &&
                "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400",
              "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
              disabled && "opacity-60 cursor-not-allowed",
              textareaClassName,
            )}
            required={required}
            disabled={disabled}
            value={value}
            {...props}
          />

          {showCharacterCount && maxLength && (
            <div className="flex justify-end">
              <span
                className={cx(
                  "text-xs",
                  isAtLimit
                    ? "text-red-500 dark:text-red-400"
                    : isNearLimit
                      ? "text-amber-500 dark:text-amber-400"
                      : "text-gray-500 dark:text-gray-400",
                )}
              >
                {characterCount} / {maxLength}
              </span>
            </div>
          )}
        </div>
      </FormField>
    );
  },
);

TextArea.displayName = "TextArea";
