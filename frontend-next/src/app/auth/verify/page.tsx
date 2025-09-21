"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function VerifyEmailPage() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const request = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("/api/auth/verify/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) setMessage(`Verification requested. Dev token: ${data.token}`);
      else setMessage(data.error || "Request failed");
    } catch {
      setMessage("Network error");
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) setMessage("Email verified.");
      else setMessage(data.error || "Verification failed");
    } catch {
      setMessage("Network error");
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Request verification</h1>
        <form onSubmit={request} className="space-y-3">
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Button type="submit" className="w-full">Send verification</Button>
        </form>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Verify token</h2>
        <form onSubmit={verify} className="space-y-3">
          <Input type="text" placeholder="Token" value={token} onChange={(e) => setToken(e.target.value)} required />
          <Button type="submit" className="w-full">Verify</Button>
        </form>
      </div>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  );
}


