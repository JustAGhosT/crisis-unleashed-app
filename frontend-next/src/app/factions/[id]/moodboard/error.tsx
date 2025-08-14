"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("MoodBoard route error:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-6">
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-destructive">
        <p className="font-semibold">Failed to load mood board.</p>
        <p className="text-xs opacity-80">{error.message}</p>
        <button
          type="button"
          onClick={() => reset()}
          className="mt-3 rounded-md border border-destructive/30 bg-background/60 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-background/80"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
