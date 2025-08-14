"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";
import { realtimeDispatcher } from "@/lib/realtime/dispatcher";

export type RealtimeStatus =
  | "disabled"
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

export interface RealtimeClient {
  status: RealtimeStatus;
  connect: () => void;
  disconnect: () => void;
  send: (event: string, payload?: unknown) => void;
  lastError?: string;
}

/**
 * Minimal no-op realtime connection scaffold guarded by feature flag.
 * When the `enableRealtime` flag is false, the hook returns a disabled client.
 */
export function useRealtimeConnection(): RealtimeClient {
  const enabled = useFeatureFlag("enableRealtime");
  const [status, setStatus] = useState<RealtimeStatus>(
    enabled ? "disconnected" : "disabled",
  );
  const lastErrorRef = useRef<string | undefined>(undefined);
  const wsRef = useRef<WebSocket | null>(null);
  const hbTimerRef = useRef<number | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const shouldReconnectRef = useRef(false);
  const attemptRef = useRef(0);
  const urlRef = useRef<string | null>(
    process.env.NEXT_PUBLIC_REALTIME_URL ?? null,
  );
  const lastPingRef = useRef<number | null>(null);
  const connectAttemptsRef = useRef(0);

  // Config
  const HEARTBEAT_MS = 15000; // 15s
  const BACKOFF_BASE_MS = 1000;
  const BACKOFF_MAX_MS = 30000;
  const BACKOFF_FACTOR = 2;
  const BACKOFF_JITTER = 0.2; // +/-20%

  useEffect(() => {
    // If flag toggles at runtime, reset status accordingly
    setStatus(enabled ? "disconnected" : "disabled");
    if (!enabled) {
      // Ensure everything is cleaned up when disabled
      shouldReconnectRef.current = false;
      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
      if (hbTimerRef.current) {
        window.clearInterval(hbTimerRef.current);
        hbTimerRef.current = null;
      }
      if (wsRef.current) {
        try {
          wsRef.current.close();
        } catch {
          /* noop */
        }
        wsRef.current = null;
      }
      attemptRef.current = 0;
    }
  }, [enabled]);

  const client = useMemo<RealtimeClient>(() => {
    if (!enabled) {
      return {
        status: "disabled",
        connect: () => {},
        disconnect: () => {},
        send: () => {},
        lastError: undefined,
      };
    }

    return {
      get status() {
        return status;
      },
      connect: () => {
        if (!enabled) return;
        if (status === "connecting" || status === "connected") return;
        if (!urlRef.current) {
          lastErrorRef.current =
            "Realtime URL not configured (NEXT_PUBLIC_REALTIME_URL)";
          setStatus("error");
          // bounce back to disconnected for UI
          window.setTimeout(() => setStatus("disconnected"), 0);
          return;
        }
        shouldReconnectRef.current = true;
        // Cancel any pending reconnect
        if (reconnectTimerRef.current) {
          window.clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }

        setStatus("connecting");
        try {
          const ws = new WebSocket(urlRef.current);
          wsRef.current = ws;

          ws.onopen = () => {
            attemptRef.current = 0; // reset backoff
            connectAttemptsRef.current += 1;
            setStatus("connected");
            realtimeDispatcher.publish("realtime:status", {
              status: "connected",
            });
            // Start heartbeat
            if (hbTimerRef.current) window.clearInterval(hbTimerRef.current);
            hbTimerRef.current = window.setInterval(() => {
              try {
                const ts = Date.now();
                lastPingRef.current = ts;
                ws.send(JSON.stringify({ type: "ping", ts }));
              } catch (err) {
                lastErrorRef.current =
                  err instanceof Error ? err.message : String(err);
              }
            }, HEARTBEAT_MS) as unknown as number;
          };

          ws.onmessage = (evt) => {
            // Expect JSON messages
            try {
              const data = JSON.parse(evt.data);
              if (data && data.type === "pong") {
                const now = Date.now();
                const sent =
                  typeof data.ts === "number" ? data.ts : lastPingRef.current;
                const rtt = sent ? Math.max(0, now - sent) : undefined;
                realtimeDispatcher.publish("realtime:pong", { ts: now, rtt });
              }
              // Future: event dispatch to subscribers
              if (
                data &&
                typeof data.type === "string" &&
                data.type !== "pong"
              ) {
                realtimeDispatcher.publish(
                  `realtime:${data.type}`,
                  data.payload ?? data,
                );
              }
            } catch {
              // ignore malformed
            }
          };

          const scheduleReconnect = () => {
            if (!enabled) return;
            if (!shouldReconnectRef.current) return;
            const pow = Math.min(attemptRef.current, 10);
            const base = Math.min(
              BACKOFF_MAX_MS,
              BACKOFF_BASE_MS * Math.pow(BACKOFF_FACTOR, pow),
            );
            const jitter = base * (BACKOFF_JITTER * (Math.random() * 2 - 1));
            const delay = Math.max(250, Math.floor(base + jitter));
            reconnectTimerRef.current = window.setTimeout(() => {
              reconnectTimerRef.current = null;
              // recurse connect
              void 0;
              attemptRef.current += 1;
              // Use the same connect function
              if (enabled && shouldReconnectRef.current) {
                // Close any stale ref
                if (wsRef.current) {
                  try {
                    wsRef.current.close();
                  } catch {
                    /* noop */
                  }
                }
                wsRef.current = null;
                // trigger a fresh connect path
                setStatus("disconnected");
                // small task queue to avoid same-tick issues
                window.setTimeout(() => {
                  if (enabled && shouldReconnectRef.current) {
                    // @ts-expect-error - we are inside the object literal; call via returned client
                  }
                }, 0);
              }
            }, delay) as unknown as number;
          };

          ws.onerror = (evt) => {
            lastErrorRef.current =
              typeof (evt as any)?.message === "string"
                ? (evt as any).message
                : "WebSocket error";
            realtimeDispatcher.publish("realtime:error", {
              message: lastErrorRef.current,
            });
          };

          ws.onclose = () => {
            setStatus("disconnected");
            realtimeDispatcher.publish("realtime:status", {
              status: "disconnected",
            });
            if (hbTimerRef.current) {
              window.clearInterval(hbTimerRef.current);
              hbTimerRef.current = null;
            }
            if (wsRef.current === ws) {
              wsRef.current = null;
            }
            if (shouldReconnectRef.current) {
              scheduleReconnect();
            }
          };
        } catch (err) {
          lastErrorRef.current =
            err instanceof Error ? err.message : String(err);
          setStatus("error");
          realtimeDispatcher.publish("realtime:error", {
            message: lastErrorRef.current,
          });
          // bounce back to disconnected and attempt reconnect
          window.setTimeout(() => {
            setStatus("disconnected");
            if (shouldReconnectRef.current) {
              attemptRef.current += 1;
              if (!reconnectTimerRef.current) {
                reconnectTimerRef.current = window.setTimeout(() => {
                  reconnectTimerRef.current = null;
                  // @ts-expect-error see note above
                }, BACKOFF_BASE_MS) as unknown as number;
              }
            }
          }, 0);
        }
      },
      disconnect: () => {
        shouldReconnectRef.current = false;
        if (reconnectTimerRef.current) {
          window.clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
        if (hbTimerRef.current) {
          window.clearInterval(hbTimerRef.current);
          hbTimerRef.current = null;
        }
        if (wsRef.current) {
          try {
            wsRef.current.close();
          } catch {
            /* noop */
          }
          wsRef.current = null;
        }
        setStatus("disconnected");
      },
      send: (_event: string, _payload?: unknown) => {
        const ws = wsRef.current;
        if (ws && status === "connected") {
          try {
            const envelope = {
              type: _event,
              payload: _payload,
              ts: Date.now(),
            };
            ws.send(JSON.stringify(envelope));
            return;
          } catch (err) {
            lastErrorRef.current =
              err instanceof Error ? err.message : String(err);
          }
        }
        lastErrorRef.current = "Cannot send while not connected";
        setStatus("error");
        window.setTimeout(() => setStatus("disconnected"), 0);
      },
      get lastError() {
        return lastErrorRef.current;
      },
    };
  }, [enabled, status]);

  return client;
}
