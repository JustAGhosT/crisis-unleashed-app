"use client";

import React, { forwardRef } from 'react';
import { FormField, FormFieldProps } from './FormField';
import { Slider } from '@/components/ui/slider';

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export interface SliderInputProps extends Omit<FormFieldProps, 'children'> {
  value?: number[];
  onChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  valuePrefix?: string;
  valueSuffix?: string;
  disabled?: boolean;
  sliderClassName?: string;
  valueDisplayClassName?: string;
}

/**
 * A reusable slider input component that combines FormField with a Slider.
 * Supports min/max values, step size, and value display.
 */
export const SliderInput = forwardRef<HTMLSpanElement, SliderInputProps>(({
  id,
  label,
  description,
  error,
  required = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  value = [0],
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  valuePrefix = "",
  valueSuffix = "",
  disabled = false,
  sliderClassName,
  valueDisplayClassName,
}, ref) => {
  const hasError = !!error;
  
  const formatValue = (val: number) => {
    return `${valuePrefix}${val}${valueSuffix}`;
  };
  
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
      <div className="space-y-4">
        {showValue && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatValue(min)}
            </span>
            <span 
              className={cx(
                "text-sm font-medium",
                hasError ? "text-red-500 dark:text-red-400" : "text-gray-900 dark:text-white",
                valueDisplayClassName
              )}
            >
              {formatValue(value[0])}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatValue(max)}
            </span>
          </div>
        )}
        
        <Slider
          id={id}
          ref={ref}
          value={value}
          onValueChange={onChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={cx(
            hasError && "text-red-500 dark:text-red-400",
            disabled && "opacity-60 cursor-not-allowed",
            sliderClassName
          )}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : undefined}
        />
      </div>
    </FormField>
  );
});

SliderInput.displayName = 'SliderInput';