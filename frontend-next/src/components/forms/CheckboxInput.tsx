"use client";

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface CheckboxInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'onChange'> {
  id: string;
  label: string;
  description?: string;
  error?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  checkboxClassName?: string;
}

/**
 * A reusable checkbox input component with label and description.
 * Supports error states and custom styling.
 */
export const CheckboxInput = forwardRef<HTMLButtonElement, CheckboxInputProps>(({
  id,
  label,
  description,
  error,
  checked = false,
  onChange,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  checkboxClassName,
  disabled = false,
  ...props
}, ref) => {
  const hasError = !!error;
  
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <Checkbox
            id={id}
            ref={ref}
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            className={cn(
              hasError && "border-red-500 focus:ring-red-500 dark:border-red-400",
              disabled && "opacity-60 cursor-not-allowed",
              checkboxClassName
            )}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${id}-error` : undefined}
            {...props}
          />
        </div>
        <div className="ml-3 text-sm">
          <Label 
            htmlFor={id} 
            className={cn(
              "font-medium text-gray-700 dark:text-gray-200",
              disabled && "opacity-60 cursor-not-allowed",
              labelClassName
            )}
          >
            {label}
          </Label>
          
          {description && (
            <p 
              className={cn(
                "text-gray-500 dark:text-gray-400", 
                descriptionClassName
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      
      {error && (
        <p 
          className={cn(
            "text-sm text-red-500 dark:text-red-400", 
            errorClassName
          )}
          id={`${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
});

CheckboxInput.displayName = 'CheckboxInput';