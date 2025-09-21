"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useEffect, useMemo, useRef, useState } from "react";

type Operation = {
  outbox_id: string;
  status: string;
  blockchain: string;
  operation_type: string;
  attempts: number;
  max_attempts: number;
  created_at?: string;
  updated_at?: string;
};

export default function OutboxAdminPage() {
  const [items, setItems] = useState<Operation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [chain, setChain] = useState<string>("");
  const [limit, setLimit] = useState<number>(25);
  const [offset, setOffset] = useState<number>(0);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (chain) params.set("blockchain", chain);
      params.set("limit", String(limit));
      params.set("offset", String(offset));
      const res = await fetch(`/api/blockchain/operations?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load operations");
      const data = (await res.json()) as Operation[];
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      setIsLoading(false);
      setLastUpdatedAt(Date.now());
    }
  };

  useEffect(() => {
    void fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, chain, limit, offset]);

  useEffect(() => {
    if (autoRefresh) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        void fetchItems();
      }, 30000) as unknown as number;
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh]);

  const retry = async (id: string) => {
    try {
      setRetryingId(id);
      const res = await fetch(`/api/blockchain/operations/retry/${encodeURIComponent(id)}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Retry failed");
      await fetchItems();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Retry failed");
    } finally {
      setRetryingId(null);
    }
  };

  const filtered = useMemo(() => items, [items]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const it of filtered) counts[it.status] = (counts[it.status] ?? 0) + 1;
    return counts;
  }, [filtered]);

  const badgeClass = (s: string) => {
    const key = s.toLowerCase();
    if (key === "completed" || key === "success") return "bg-green-900/40 text-green-200 border-green-800";
    if (key === "failed" || key === "error") return "bg-red-900/40 text-red-200 border-red-800";
    if (key === "processing" || key === "pending") return "bg-amber-900/30 text-amber-200 border-amber-800";
    return "bg-slate-700/50 text-slate-200 border-slate-600";
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard?.writeText(text);
    } catch {
      // ignore
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-2xl text-white">Blockchain Outbox</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex gap-3 flex-wrap items-end">
              <div className="flex flex-col gap-2 w-full md:w-48">
                <label className="text-sm text-slate-300">Status</label>
                <Select value={status} onChange={(e) => { setOffset(0); setStatus(e.target.value); }}>
                  <option value="">Any</option>
                  <option value="pending">pending</option>
                  <option value="processing">processing</option>
                  <option value="completed">completed</option>
                  <option value="failed">failed</option>
                </Select>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-48">
                <label className="text-sm text-slate-300">Blockchain</label>
                <Input placeholder="etherlink | ethereum | solana" value={chain} onChange={(e) => { setOffset(0); setChain(e.target.value); }} />
              </div>
              <div className="flex flex-col gap-2 w-full md:w-36">
                <label className="text-sm text-slate-300">Limit</label>
                <Input type="number" min={1} max={100} value={limit} onChange={(e) => { setOffset(0); setLimit(Number(e.target.value || 25)); }} />
              </div>
              <Button onClick={() => void fetchItems()} disabled={isLoading}>
                {isLoading ? "Loading..." : "Refresh"}
              </Button>
            </div>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
                Auto-refresh (30s)
              </label>
              <span className="text-slate-400">Last updated: {lastUpdatedAt ? new Date(lastUpdatedAt).toLocaleTimeString() : "-"}</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap text-xs">
            {Object.entries(statusCounts).map(([k, v]) => (
              <span key={k} className={`px-2 py-1 rounded border ${badgeClass(k)}`}>{k}: {v}</span>
            ))}
            <span className="px-2 py-1 rounded border bg-slate-700/40 text-slate-200 border-slate-600">total: {filtered.length}</span>
          </div>
          <div className="flex flex-col md:flex-row gap-3 items-end">
            <div className="flex flex-col gap-2 w-full md:w-48">
              <label className="text-sm text-slate-300">Status</label>
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">Any</option>
                <option value="pending">pending</option>
                <option value="processing">processing</option>
                <option value="completed">completed</option>
                <option value="failed">failed</option>
              </Select>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-48">
              <label className="text-sm text-slate-300">Blockchain</label>
              <Input placeholder="etherlink | ethereum | solana" value={chain} onChange={(e) => setChain(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 w-full md:w-36">
              <label className="text-sm text-slate-300">Limit</label>
              <Input type="number" min={1} max={100} value={limit} onChange={(e) => setLimit(Number(e.target.value || 25))} />
            </div>
            <Button onClick={() => void fetchItems()} disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>

          {error && (
            <div className="text-red-300 text-sm">{error}</div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-700 text-slate-300">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Blockchain</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Attempts</th>
                  <th className="py-2 pr-4">Updated</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((op) => (
                  <tr key={op.outbox_id} className="border-b border-slate-800 text-slate-100">
                    <td className="py-2 pr-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span>{op.outbox_id}</span>
                        <Button size="xs" variant="outline" onClick={() => void copy(op.outbox_id)}>Copy</Button>
                      </div>
                    </td>
                    <td className="py-2 pr-4">
                      <span className={`px-2 py-1 rounded border ${badgeClass(op.status)}`}>{op.status}</span>
                    </td>
                    <td className="py-2 pr-4">{op.blockchain}</td>
                    <td className="py-2 pr-4">{op.operation_type}</td>
                    <td className="py-2 pr-4">{op.attempts}/{op.max_attempts}</td>
                    <td className="py-2 pr-4">{op.updated_at || "-"}</td>
                    <td className="py-2 pr-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => void retry(op.outbox_id)} disabled={op.status !== "failed" || retryingId === op.outbox_id}>
                          {retryingId === op.outbox_id ? "Retrying..." : "Retry"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between pt-2 text-sm text-slate-300">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setOffset(Math.max(0, offset - limit))} disabled={offset === 0 || isLoading}>Prev</Button>
              <Button variant="outline" size="sm" onClick={() => setOffset(offset + limit)} disabled={isLoading}>Next</Button>
            </div>
            <div>offset {offset} · limit {limit}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


