"use client";

import React, { useState } from "react";
import { Faction, FactionId } from "@/types/faction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { FactionGrid } from "./FactionGrid";
import { Badge } from "@/components/ui/badge";
import { getFactionColorClass } from "@/lib/utils";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";
import { useSafeTheme } from "@/lib/theme/theme-utils";

interface FactionSelectorProps {
  factions: Faction[];
  selectedFaction?: FactionId | null;
  onSelect: (faction: Faction) => void;
  buttonText?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FactionSelector({
  factions,
  selectedFaction,
  onSelect,
  buttonText = "Select Faction",
  required = false,
  disabled = false,
}: FactionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelection, setTempSelection] = useState<Faction | null>(
    selectedFaction
      ? factions.find((f) => f.id === selectedFaction) || null
      : null,
  );

  const isNewThemeEnabled = useFeatureFlag("useNewTheme");
  const { isDark } = useSafeTheme();

  const handleFactionClick = (faction: Faction) => {
    setTempSelection(faction);
  };

  const handleConfirm = () => {
    if (tempSelection) {
      onSelect(tempSelection);
      setIsOpen(false);
    }
  };

  // Get the currently selected faction object
  const currentFaction = selectedFaction
    ? factions.find((f) => f.id === selectedFaction)
    : null;

  // Apply theme-aware styling
  const buttonStyle =
    isNewThemeEnabled && isDark
      ? "bg-gray-700 hover:bg-gray-600 text-white"
      : "";

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant={currentFaction ? "outline" : "default"}
            disabled={disabled}
            className={`w-full justify-between ${buttonStyle}`}
          >
            <span>
              {currentFaction ? (
                <span className="flex items-center gap-2">
                  <span className={getFactionColorClass(currentFaction.id)}>
                    {currentFaction.name}
                  </span>
                </span>
              ) : (
                <span>{buttonText}</span>
              )}
            </span>
            {currentFaction && (
              <Badge
                variant="outline"
                className={`ml-2 ${getFactionColorClass(currentFaction.id)}`}
              >
                Selected
              </Badge>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[900px] dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>Choose Your Faction</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Select the faction you wish to represent in battle.
              {required && " You must select a faction to continue."}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 max-h-[60vh] overflow-y-auto">
            <FactionGrid
              factions={factions}
              onFactionClick={handleFactionClick}
            />
          </div>

          <DialogFooter className="flex justify-between items-center">
            <div>
              {tempSelection && (
                <div className="text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Selected:{" "}
                  </span>
                  <span className={getFactionColorClass(tempSelection.id)}>
                    {tempSelection.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={!tempSelection}>
                Confirm Selection
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {currentFaction && (
        <div className="mt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentFaction.tagline}
          </p>
        </div>
      )}
    </div>
  );
}
