"use client";

import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export type RadioGroupProps = React.HTMLAttributes<HTMLDivElement>;

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} role="radiogroup" className={cx(className)} {...props}>
      {children}
    </div>
  ),
);
RadioGroup.displayName = "RadioGroup";

export type RadioGroupItemProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
>;

export const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  RadioGroupItemProps
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="radio"
    className={cx(
      "h-4 w-4 rounded-full border border-input text-primary",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "dark:bg-gray-800 dark:border-gray-700",
      className,
    )}
    {...props}
  />
));
RadioGroupItem.displayName = "RadioGroupItem";
