"use client";

import * as React from "react";

function cx(...classes: Array<string | undefined | false | null>): string {
  return classes.filter(Boolean).join(" ");
}

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  viewportClassName?: string;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, viewportClassName, ...props }, ref) => {
    return (
      <div ref={ref} className={cx("relative", className)} {...props}>
        <div className={cx("overflow-auto", viewportClassName)}>{children}</div>
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

export default ScrollArea;
