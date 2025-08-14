"use client";

import * as React from "react";
import { format as formatDate } from "date-fns";

// Minimal class merge
function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  mode?: "single"; // stub for API compatibility
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: boolean | ((date: Date) => boolean);
  initialFocus?: boolean; // no-op in this minimal version
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, selected, onSelect, disabled, ...props }, ref) => {
    const toInputValue = (d?: Date) => (d ? formatDate(d, "yyyy-MM-dd") : "");
    const [value, setValue] = React.useState<string>(toInputValue(selected));

    React.useEffect(() => {
      setValue(toInputValue(selected));
    }, [selected]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setValue(val);
      if (!onSelect) return;
      if (!val) {
        onSelect(undefined);
        return;
      }
      const parts = val.split("-");
      const d = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2]),
      );
      // Apply disabled predicate if provided as function
      if (typeof disabled === "function" && disabled(d)) {
        return;
      }
      onSelect(d);
    };

    const isDisabled = typeof disabled === "boolean" ? disabled : false;

    return (
      <div ref={ref} className={cx("p-3", className)} {...props}>
        <input
          type="date"
          className={cx(
            "w-full rounded-md border bg-background px-3 py-2 text-sm",
            "border-input focus:outline-none focus:ring-2 focus:ring-ring",
            "dark:bg-gray-800 dark:border-gray-700 dark:text-white",
          )}
          value={value}
          onChange={handleChange}
          disabled={isDisabled}
          aria-label="Select date"
        />
      </div>
    );
  },
);

Calendar.displayName = "Calendar";
