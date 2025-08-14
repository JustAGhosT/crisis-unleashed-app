"use client";

import React, { forwardRef } from "react";
import { FormField, FormFieldProps } from "./FormField";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// minimal class merge to avoid cn dependency
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface DatePickerProps extends Omit<FormFieldProps, "children"> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  triggerClassName?: string;
  calendarClassName?: string;
  dateFormat?: string;
}

/**
 * A reusable date picker component that combines FormField with a Calendar.
 * Supports date range validation and custom formatting.
 */
export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(
  (
    {
      id,
      label,
      description,
      error,
      required = false,
      className,
      labelClassName,
      descriptionClassName,
      errorClassName,
      value,
      onChange,
      placeholder = "Select date",
      disabled = false,
      minDate,
      maxDate,
      triggerClassName,
      calendarClassName,
      dateFormat = "PPP", // Default format: 'April 29, 2023'
    },
    ref,
  ) => {
    const hasError = !!error;

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
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={id}
              ref={ref}
              variant="outline"
              disabled={disabled}
              className={cx(
                "w-full justify-start text-left font-normal",
                !value && "text-muted-foreground",
                hasError &&
                  "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400",
                "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
                disabled && "opacity-60 cursor-not-allowed",
                triggerClassName,
              )}
              aria-invalid={hasError ? "true" : "false"}
              aria-describedby={hasError ? `${id}-error` : undefined}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(value, dateFormat) : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-gray-800 dark:border-gray-700">
            <Calendar
              mode="single"
              selected={value}
              onSelect={onChange}
              disabled={
                disabled ||
                ((date) => {
                  const isBeforeMin = minDate ? date < minDate : false;
                  const isAfterMax = maxDate ? date > maxDate : false;
                  return isBeforeMin || isAfterMax;
                })
              }
              initialFocus
              className={cx(
                "dark:bg-gray-800 dark:text-white",
                calendarClassName,
              )}
            />
          </PopoverContent>
        </Popover>
      </FormField>
    );
  },
);

DatePicker.displayName = "DatePicker";
