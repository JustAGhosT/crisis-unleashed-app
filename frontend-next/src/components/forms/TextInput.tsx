"use client";

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { FormField, FormFieldProps } from './FormField';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface TextInputProps extends Omit<FormFieldProps, 'children'>, 
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';
  inputClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
}

/**
 * A reusable text input component that combines FormField with an Input.
 * Supports various input types, icons, and clear functionality.
 */
export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(({
  id,
  label,
  description,
  error,
  required = false,
  className,
  inputClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  type = 'text',
  leftIcon,
  rightIcon,
  onClear,
  disabled,
  ...props
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
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <Input
          id={id}
          ref={ref}
          type={type}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className={cn(
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            hasError && "border-red-500 focus:ring-red-500 focus:border-red-500 dark:border-red-400",
            "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
            disabled && "opacity-60 cursor-not-allowed",
            inputClassName
          )}
          required={required}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </div>
        )}
        
        {onClear && props.value && (
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            onClick={onClear}
            aria-label="Clear input"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                clipRule="evenodd" 
              />
            </svg>
          </button>
        )}
      </div>
    </FormField>
  );
});

TextInput.displayName = 'TextInput';