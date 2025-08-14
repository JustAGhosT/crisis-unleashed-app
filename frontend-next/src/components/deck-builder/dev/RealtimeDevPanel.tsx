import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";
import { useRealtimeConnection } from "@/lib/realtime/connection";
import { cn } from "@/lib/utils";

export function RealtimeDevPanel() {
  const enabled = useFeatureFlag("enableRealtime");
  const rt = useRealtimeConnection();
  if (!enabled) return null;
  return (
    <Card className="bg-slate-800/50 border-slate-600">
      <CardHeader>
        <CardTitle className="text-sm">Realtime Dev Panel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm">
          <span>Status:</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full",
              rt.status === "connected" && "bg-green-500/20 text-green-400",
              rt.status === "connecting" && "bg-amber-500/20 text-amber-300",
              (rt.status === "disconnected" || rt.status === "disabled") &&
                "bg-slate-600/30 text-slate-300",
              rt.status === "error" && "bg-red-500/20 text-red-400",
            )}
          >
            {rt.status}
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => rt.connect()}
            disabled={rt.status === "connected" || rt.status === "disabled"}
          >
            Connect
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => rt.disconnect()}
            disabled={rt.status !== "connected"}
          >
            Disconnect
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => rt.send("ping", { t: Date.now() })}
            disabled={rt.status !== "connected"}
          >
            Send ping
          </Button>
        </div>
        {rt.lastError && (
          <div className="mt-2 text-xs text-red-400">{rt.lastError}</div>
        )}
      </CardContent>
    </Card>
  );
}

RealtimeDevPanel.displayName = "RealtimeDevPanel";
