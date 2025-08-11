"use client";

import React, { forwardRef } from 'react';
import { FormField, FormFieldProps } from './FormField';
import { RadioGroup as UIRadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<FormFieldProps, 'children'> {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  radioClassName?: string;
  radioLabelClassName?: string;
  radioDescriptionClassName?: string;
}

/**
 * A reusable radio group component that combines FormField with a RadioGroup.
 * Supports horizontal or vertical orientation and option descriptions.
 */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(({
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
  orientation = 'vertical',
  radioClassName,
  radioLabelClassName,
  radioDescriptionClassName,
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
      <UIRadioGroup
        ref={ref}
        value={value}
        onValueChange={onChange}
        className={cn(
          orientation === 'horizontal' ? "flex flex-row space-x-4" : "flex flex-col space-y-3",
          hasError && "text-red-500 dark:text-red-400"
        )}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${id}-error` : undefined}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <RadioGroupItem
              id={`${id}-${option.value}`}
              value={option.value}
              disabled={option.disabled}
              className={cn(
                hasError && "border-red-500 text-red-500 focus:ring-red-500 dark:border-red-400",
                option.disabled && "opacity-60 cursor-not-allowed",
                radioClassName
              )}
            />
            <div className="ml-2">
              <Label
                htmlFor={`${id}-${option.value}`}
                className={cn(
                  "font-medium text-gray-700 dark:text-gray-200",
                  option.disabled && "opacity-60 cursor-not-allowed",
                  radioLabelClassName
                )}
              >
                {option.label}
              </Label>
              {option.description && (
                <p
                  className={cn(
                    "text-sm text-gray-500 dark:text-gray-400",
                    radioDescriptionClassName
                  )}
                >
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </UIRadioGroup>
    </FormField>
  );
});

RadioGroup.displayName = 'RadioGroup';