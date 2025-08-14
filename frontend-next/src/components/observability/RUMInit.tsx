"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/rum/web-vitals";

export function RUMInit() {
  useEffect(() => {
    // Only run in production unless explicitly enabled
    const enabled =
      process.env.NEXT_PUBLIC_RUM_ENABLED === "true" ||
      process.env.NODE_ENV === "production";
    if (enabled && typeof window !== "undefined") {
      initWebVitals();
    }
  }, []);

  return null;
}
