"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Check, AlertCircle } from 'lucide-react';

interface Step {
  id: string;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: string;
  errors: Record<string, boolean>;
}

export default function StepIndicator({ steps, currentStep, errors }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          // Determine if this step is active, completed, or has errors
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
          const hasError = errors[step.id];
          
          // Determine the step number
          const stepNumber = index + 1;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center">
                <div 
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full text-white font-medium text-sm relative",
                    isActive && "bg-blue-600 ring-4 ring-blue-100 dark:ring-blue-900/30",
                    isCompleted && !hasError && "bg-green-600",
                    hasError && "bg-red-600",
                    !isActive && !isCompleted && !hasError && "bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                  )}
                >
                  {isCompleted && !hasError ? (
                    <Check className="w-5 h-5" />
                  ) : hasError ? (
                    <AlertCircle className="w-5 h-5" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span 
                  className={cn(
                    "mt-2 text-sm font-medium",
                    isActive && "text-blue-600 dark:text-blue-400",
                    isCompleted && !hasError && "text-green-600 dark:text-green-400",
                    hasError && "text-red-600 dark:text-red-400",
                    !isActive && !isCompleted && !hasError && "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-2",
                    isCompleted && !errors[steps[index + 1].id] ? "bg-green-600 dark:bg-green-500" : "bg-gray-300 dark:bg-gray-700"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}