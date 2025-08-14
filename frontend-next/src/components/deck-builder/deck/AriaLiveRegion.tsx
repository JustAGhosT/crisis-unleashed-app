import React from "react";

interface AriaLiveRegionProps {
  message: string;
  assertive?: boolean;
}

export const AriaLiveRegion: React.FC<AriaLiveRegionProps> = ({
  message,
  assertive = false,
}) => (
  <div
    className="sr-only"
    aria-live={assertive ? "assertive" : "polite"}
    aria-atomic="true"
  >
    {message}
  </div>
);

AriaLiveRegion.displayName = "AriaLiveRegion";
