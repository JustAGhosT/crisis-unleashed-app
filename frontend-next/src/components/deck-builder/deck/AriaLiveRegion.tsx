import React from "react";

interface AriaLiveRegionProps {
  message: string;
  assertive?: boolean;
}

export const AriaLiveRegion: React.FC<AriaLiveRegionProps> = ({
  message,
  assertive = false,
}) => (
  assertive ? (
    <div className="sr-only" aria-live="assertive" aria-atomic="true">
      {message}
    </div>
  ) : (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  )
);

AriaLiveRegion.displayName = "AriaLiveRegion";
