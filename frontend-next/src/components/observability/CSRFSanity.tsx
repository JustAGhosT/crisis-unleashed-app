"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function CSRFSanity() {
  const [token, setToken] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setToken(d.token))
      .catch(() => setToken(null));
  }, []);

  const testReset = async () => {
    setResult(null);
    const res = await fetch("/api/auth/reset/request", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRF-Token": token || "" },
      body: JSON.stringify({ email: "test@example.com" }),
    });
    const data = await res.json();
    setResult(`${res.status}: ${JSON.stringify(data)}`);
  };

  return (
    <div className="text-sm space-y-2">
      <div>CSRF token: <span className="font-mono">{token || "(loading)"}</span></div>
      <Button size="sm" variant="outline" onClick={testReset} disabled={!token}>Test CSRF POST</Button>
      {result && <div className="text-muted-foreground">{result}</div>}
    </div>
  );
}


