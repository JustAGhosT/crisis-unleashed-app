"use client";

import React, { forwardRef, useState, useRef, InputHTMLAttributes } from 'react';
import { FormField, FormFieldProps } from './FormField';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FileInputProps extends Omit<FormFieldProps, 'children'>,
  Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type' | 'onChange'> {
  onChange?: (files: FileList | null) => void;
  accept?: string;
  multiple?: boolean;
  buttonText?: string;
  dragActiveText?: string;
  dragInactiveText?: string;
  showSelectedFiles?: boolean;
  maxFiles?: number;
  maxSizeInMB?: number;
  inputClassName?: string;
  buttonClassName?: string;
  fileListClassName?: string;
}

/**
 * A reusable file input component that combines FormField with a custom file input.
 * Supports drag and drop, file validation, and file list display.
 */
export const FileInput = forwardRef<HTMLInputElement, FileInputProps>(({
  id,
  label,
  description,
  error,
  required = false,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  onChange,
  accept,
  multiple = false,
  buttonText = "Choose file",
  dragActiveText = "Drop files here",
  dragInactiveText = "or drag and drop files here",
  showSelectedFiles = true,
  maxFiles = 5,
  maxSizeInMB = 5,
  disabled = false,
  inputClassName,
  buttonClassName,
  fileListClassName,
  ...props
}, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasError = !!error || !!fileError;
  
  const handleFileChange = (files: FileList | null) => {
    if (!files) return;
    
    // Validate files
    const fileArray = Array.from(files);
    let validationError = null;
    
    // Check number of files
    if (multiple && fileArray.length > maxFiles) {
      validationError = `You can only upload up to ${maxFiles} files`;
    }
    
    // Check file size
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    const oversizedFiles = fileArray.filter(file => file.size > maxSizeInBytes);
    if (oversizedFiles.length > 0) {
      validationError = `Some files exceed the maximum size of ${maxSizeInMB}MB`;
    }
    
    setFileError(validationError);
    
    if (!validationError) {
      setSelectedFiles(multiple ? fileArray : [fileArray[0]]);
      onChange?.(files);
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };
  
  const handleButtonClick = () => {
    inputRef.current?.click();
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
    
    // Create a new FileList-like object
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    onChange?.(dataTransfer.files);
  };
  
  return (
    <FormField
      id={id}
      label={label}
      description={description}
      error={error || fileError}
      required={required}
      className={className}
      labelClassName={labelClassName}
      descriptionClassName={descriptionClassName}
      errorClassName={errorClassName}
    >
      <div
        className={cn(
          "border-2 border-dashed rounded-md p-4",
          dragActive ? "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20" : 
            "border-gray-300 dark:border-gray-700",
          hasError && "border-red-500 dark:border-red-400",
          disabled && "opacity-60 cursor-not-allowed",
          inputClassName
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          id={id}
          ref={(node) => {
            // Handle both refs
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          className="sr-only"
          disabled={disabled}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${id}-error` : undefined}
          {...props}
        />
        
        <div className="text-center">
          <Button
            type="button"
            onClick={handleButtonClick}
            disabled={disabled}
            className={cn(
              "mb-2",
              buttonClassName
            )}
          >
            {buttonText}
          </Button>
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {dragActive ? dragActiveText : dragInactiveText}
          </p>
          
          {accept && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Accepted file types: {accept}
            </p>
          )}
        </div>
      </div>
      
      {showSelectedFiles && selectedFiles.length > 0 && (
        <ul className={cn("mt-2 space-y-1", fileListClassName)}>
          {selectedFiles.map((file, index) => (
            <li key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="truncate max-w-xs">{file.name}</span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  {(file.size / 1024).toFixed(0)} KB
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                aria-label={`Remove ${file.name}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </FormField>
  );
});

FileInput.displayName = 'FileInput';