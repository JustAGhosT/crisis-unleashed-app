"use client";

import React, { forwardRef } from 'react';
import { FormField, FormFieldProps } from './FormField';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectInputProps extends Omit<FormFieldProps, 'children'> {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  selectClassName?: string;
  itemClassName?: string;
}

/**
 * A reusable select input component that combines FormField with a Select.
 * Supports custom styling and disabled options.
 */
export const SelectInput = forwardRef<HTMLSelectElement, SelectInputProps>(({
  id,
  label,
  description,
  error,
  required = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  selectClassName,
  itemClassName,
}, ref) => {
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
      <select
        id={id}
        ref={ref}
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          hasError && "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400",
          "w-full rounded-md border px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white",
          disabled && "opacity-60 cursor-not-allowed",
          selectClassName
        )}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
        title={label}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={cn(
              "dark:text-white",
              option.disabled && "opacity-50",
              itemClassName
            )}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
});

SelectInput.displayName = 'SelectInput';