"use client";

import * as React from "react";
import styles from "./progress.module.css";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface ProgressProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "aria-valuenow"> {
  value?: number; // 0-100
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, ...props }, ref) => {
    const clamped = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        className={cx(
          "w-full h-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden",
          styles.progress,
          className,
        )}
        {...props}
      >
        {/* Semantic progress element for accessibility; hidden visually */}
        <progress value={clamped} max={100} className="sr-only" />
        {/* Visual bar (decorative) */}
        <div
          className={cx(
            "h-full bg-primary transition-all",
            "dark:bg-blue-500",
            styles.progressBar,
          )}
        />
      </div>
    );
  },
);

Progress.displayName = "Progress";

export default Progress;
