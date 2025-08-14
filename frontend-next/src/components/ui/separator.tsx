"use client";

import * as React from "react";

function cx(...classes: Array<string | undefined | false | null>): string {
  return classes.filter(Boolean).join(" ");
}

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref,
  ) => {
    const isVertical = orientation === "vertical";
    // ARIA handling via spread object to avoid invalid attribute placeholders in static analyzers:
    // - Horizontal: no ARIA.
    // - Vertical decorative: aria-hidden only.
    // - Vertical non-decorative: role and aria-orientation.
    const ariaProps = isVertical
      ? decorative
        ? { "aria-hidden": true as const }
        : {
            role: "separator" as const,
            "aria-orientation": "vertical" as const,
          }
      : {};
    return (
      <div
        ref={ref}
        {...ariaProps}
        className={cx(
          "shrink-0 bg-border/70 dark:bg-border",
          isVertical ? "w-px h-full" : "h-px w-full",
          className,
        )}
        {...props}
      />
    );
  },
);
Separator.displayName = "Separator";

export default Separator;
