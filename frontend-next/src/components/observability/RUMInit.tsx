"use client";

import { initWebVitals } from "@/lib/rum/web-vitals";
import { useEffect } from "react";

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

  // Register service worker for caching (noop if unsupported)
  useEffect(() => {
    import("@/lib/sw/register-sw").then((m) => m.registerServiceWorker());
  }, []);

  return null;
}
