"use client";

import * as React from "react";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface SliderProps extends React.HTMLAttributes<HTMLSpanElement> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(
  (
    { value = [0], onValueChange, min = 0, max = 100, step = 1, disabled, className, ...props },
    ref
  ) => {
    const current = Array.isArray(value) && value.length ? value[0] : 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(e.target.value);
      onValueChange?.([next]);
    };

    return (
      <span ref={ref} className={cx("block", className)} {...props}>
        <input
          type="range"
          className={cx(
            "w-full cursor-pointer appearance-none bg-transparent",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          value={current}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          disabled={disabled}
          aria-label="Slider"
        />
      </span>
    );
  }
);

Slider.displayName = "Slider";

export default Slider;
