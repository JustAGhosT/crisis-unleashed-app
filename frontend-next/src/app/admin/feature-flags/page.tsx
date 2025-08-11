"use client";

import React, { useState, useMemo } from 'react';
import { useFeatureFlags, FeatureFlags } from '@/hooks/useFeatureFlags';
import { useToast } from '@/hooks/useToast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

// Feature Flag Card Component
interface FeatureFlagCardProps {
  title: string;
  description: string;
  flagKey: keyof FeatureFlags;
  enabled: boolean;
  setFlag: (key: keyof FeatureFlags, value: boolean) => void;
}

function FeatureFlagCard({ title, description, flagKey, enabled, setFlag }: FeatureFlagCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg">{title}</h3>
        <div className="flex items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={() => setFlag(flagKey, !enabled)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function AdminContent() {
  const { flags, setFlag } = useFeatureFlags();
  const { toast } = useToast();
  const [confirmEnableOpen, setConfirmEnableOpen] = useState(false);
  const [confirmDisableOpen, setConfirmDisableOpen] = useState(false);
  const [isBatchLoading, setIsBatchLoading] = useState(false);
  const allFlagKeys = useMemo(() => Object.keys(flags) as (keyof typeof flags)[], [flags]);

  // Group flags by category
  const migrationFlags = [
    { key: 'useNewFactionUI', title: 'Faction UI', description: 'New faction cards and detail pages' },
    { key: 'useNewDeckBuilder', title: 'Deck Builder', description: 'New deck builder interface with improved UX' },
    { key: 'useNewCardDisplay', title: 'Card Display', description: 'Redesigned card layout and animations' },
    { key: 'useNewNavigation', title: 'Navigation', description: 'New header and navigation components' },
    { key: 'useNewTheme', title: 'Theme System', description: 'New theming with dark/light mode support' },
  ];
  
  const newFeatureFlags = [
    { key: 'enableAdvancedDeckAnalytics', title: 'Advanced Deck Analytics', description: 'Statistical analysis and deck performance metrics' },
    { key: 'enableCardAnimations', title: 'Card Animations', description: 'Enhanced visual effects for card interactions' },
    { key: 'enableMultiplayerChat', title: 'Multiplayer Chat', description: 'In-game chat functionality for multiplayer games' },
    { key: 'enableTournamentMode', title: 'Tournament Mode', description: 'Competitive tournament features and brackets' },
    { key: 'enableAIOpponent', title: 'AI Opponent', description: 'Play against an AI-powered opponent' },
  ];

  // Handle batch operations
  const handleBatch = async (enable: boolean) => {
    try {
      setIsBatchLoading(true);
      // Apply locally and fire POST side-effect per flag (provider handles persistence)
      for (const key of allFlagKeys) {
        setFlag(key, enable);
      }
      toast({
        title: enable ? "All flags enabled" : "All flags disabled",
        description: enable
          ? "All feature flags have been turned on."
          : "All feature flags have been turned off.",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Batch update failed",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsBatchLoading(false);
      setConfirmEnableOpen(false);
      setConfirmDisableOpen(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Feature Flag Administration</h1>

      {/* Migration Features Section */}
      <h2 className="text-xl font-semibold mb-4 mt-6">Migration Features</h2>
      <p className="text-muted-foreground mb-4">These features have been fully migrated to Next.js and are enabled by default.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {migrationFlags.map(flag => (
        <FeatureFlagCard
            key={flag.key}
            title={flag.title}
            description={flag.description}
            flagKey={flag.key as keyof FeatureFlags}
            enabled={flags[flag.key as keyof FeatureFlags]}
          setFlag={setFlag}
        />
        ))}
      </div>

      {/* New Features Section */}
      <h2 className="text-xl font-semibold mb-4 mt-10">New Features</h2>
      <p className="text-muted-foreground mb-4">These features are currently in development and can be enabled for testing.</p>
      <div className="grid gap-6 md:grid-cols-2">
        {newFeatureFlags.map(flag => (
          <FeatureFlagCard
            key={flag.key}
            title={flag.title}
            description={flag.description}
            flagKey={flag.key as keyof FeatureFlags}
            enabled={flags[flag.key as keyof FeatureFlags]}
            setFlag={setFlag}
          />
        ))}
      </div>

      {/* Batch operations buttons */}
      <div className="mt-6 flex gap-4">
        <Dialog open={confirmEnableOpen} onOpenChange={setConfirmEnableOpen}>
          <DialogTrigger asChild>
            <Button variant="default" disabled={isBatchLoading}>
              {isBatchLoading ? "Processing…" : "Enable All"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enable all feature flags?</DialogTitle>
              <DialogDescription>
                This will turn on every feature flag for your session. Continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmEnableOpen(false)} disabled={isBatchLoading}>
                Cancel
              </Button>
              <Button onClick={() => handleBatch(true)} disabled={isBatchLoading}>
                {isBatchLoading ? "Enabling…" : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={confirmDisableOpen} onOpenChange={setConfirmDisableOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" disabled={isBatchLoading}>
              {isBatchLoading ? "Processing…" : "Disable All"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Disable all feature flags?</DialogTitle>
              <DialogDescription>
                This will turn off every feature flag for your session. Continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDisableOpen(false)} disabled={isBatchLoading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleBatch(false)} disabled={isBatchLoading}>
                {isBatchLoading ? "Disabling…" : "Confirm"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function FeatureFlagsPage() {
  return <AdminContent />;
}