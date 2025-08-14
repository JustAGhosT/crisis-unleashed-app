"use client";

import React from "react";
import { FeatureFlags } from "@/hooks/useFeatureFlags";
import { Switch } from "@/components/ui/switch";

interface FeatureFlagCardProps {
  title: string;
  description: string;
  flagKey: keyof FeatureFlags;
  enabled: boolean;
  setFlag: (key: string, value: boolean) => void;
}

export function FeatureFlagCard({
  title,
  description,
  flagKey,
  enabled,
  setFlag,
}: FeatureFlagCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{title}</h3>
        <div className="flex items-center">
          <Switch
            id={`switch-${flagKey}`}
            checked={enabled}
            onCheckedChange={(checked) => setFlag(flagKey, checked)}
          />
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
