"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("MoodBoard route error:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-6">
      <div
        role="alert"
        aria-live="polite"
        aria-atomic="true"
        className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive"
      >
        <p className="font-semibold">Something went wrong.</p>
        <p className="text-xs opacity-80">Please try again.</p>
        {process.env.NODE_ENV !== "production" && (
          <div className="mt-2 text-[10px] opacity-80">
            <p className="font-mono">{error.message}</p>
            {error.digest && <p className="font-mono">digest: {error.digest}</p>}
          </div>
        )}
        <button
          type="button"
          onClick={reset}
          className="mt-3 rounded-md border border-destructive/30 bg-background/60 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-background/80"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
