"use client";

import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cx(
          "h-4 w-4 rounded border border-input text-primary",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          "ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          "dark:bg-gray-800 dark:border-gray-700",
          className,
        )}
        checked={!!checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        {...props}
      />
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
