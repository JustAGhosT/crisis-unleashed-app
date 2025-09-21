"use client";

import CSRFSanity from "@/components/observability/CSRFSanity";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DevAdminPage() {
  const [noHeaderResult, setNoHeaderResult] = useState<string | null>(null);

  const testWithoutHeader = async () => {
    setNoHeaderResult(null);
    const res = await fetch("/api/auth/reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const data = await res.json();
    setNoHeaderResult(`${res.status}: ${JSON.stringify(data)}`);
  };

  return (
    <div className="container mx-auto max-w-3xl py-10 space-y-8">
      <h1 className="text-2xl font-bold">Dev Admin</h1>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">CSRF Validation</h2>
        <p className="text-sm text-muted-foreground">Expected: 403 without header, 200 with header.</p>
        <div className="flex items-center gap-3">
          <CSRFSanity />
          <div className="space-y-2">
            <Button size="sm" variant="outline" onClick={testWithoutHeader}>Test without header</Button>
            {noHeaderResult && (
              <div className="text-sm text-muted-foreground">{noHeaderResult}</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}


