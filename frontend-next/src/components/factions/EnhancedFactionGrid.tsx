"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FactionGrid } from "./FactionGrid";
import { Faction, FactionId } from "@/types/faction";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSafeTheme } from "@/lib/theme/theme-utils";
import { useFeatureFlag } from "@/lib/feature-flags/useFeatureFlag";

interface EnhancedFactionGridProps {
  factions: Faction[];
  title?: string;
  description?: string;
}

type SortOption = "name" | "difficulty";
type FilterOption =
  | "all"
  | FactionId
  | "energy"
  | "stealth"
  | "time"
  | "mind"
  | "adaptation"
  | "sacrifice";

export function EnhancedFactionGrid({
  factions,
  title = "Factions",
  description = "Choose your faction to begin your journey",
}: EnhancedFactionGridProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const { isDark } = useSafeTheme();
  const isNewThemeEnabled = useFeatureFlag("useNewTheme");

  // Filter factions based on search query and filter option
  const filteredFactions = useMemo(() => {
    return factions.filter((faction) => {
      // Text search
      const matchesSearch =
        faction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faction.tagline.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Filter by faction type or mechanic
      if (filterBy === "all") return true;
      if (filterBy === faction.id) return true;

      // Filter by mechanics
      if (filterBy === "energy" && faction.mechanics.energyManipulation)
        return true;
      if (filterBy === "stealth" && faction.mechanics.stealth) return true;
      if (filterBy === "time" && faction.mechanics.timeWarp) return true;
      if (filterBy === "mind" && faction.mechanics.mindControl) return true;
      if (filterBy === "adaptation" && faction.mechanics.adaptation)
        return true;
      if (filterBy === "sacrifice" && faction.mechanics.sacrifice) return true;

      return false;
    });
  }, [factions, searchQuery, filterBy]);

  // Sort factions based on sort option
  const sortedFactions = useMemo(() => {
    return [...filteredFactions].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      // This is a placeholder for difficulty sorting
      // In a real implementation, you would have a difficulty property
      const difficultyMap: Record<FactionId, number> = {
        solaris: 1,
        umbral: 2,
        aeonic: 4,
        primordial: 3,
        infernal: 5,
        neuralis: 3,
        synthetic: 2,
      };

      return difficultyMap[a.id] - difficultyMap[b.id];
    });
  }, [filteredFactions, sortBy]);

  const handleFactionClick = (faction: Faction) => {
    router.push(`/factions/${faction.id}`);
  };

  // Get card styling based on theme
  const cardStyle =
    isNewThemeEnabled && isDark
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200";

  return (
    <div className="space-y-6">
      <Card className={`${cardStyle} transition-colors duration-200`}>
        <CardHeader>
          <CardTitle className="dark:text-white">{title}</CardTitle>
          <CardDescription className="dark:text-gray-300">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Search input */}
            <div>
              <Label htmlFor="search" className="mb-2 block dark:text-gray-200">
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search factions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Sort select */}
            <div>
              <label htmlFor="sort" className="mb-2 block dark:text-gray-200">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                title="Sort By"
              >
                <option value="name">Name</option>
                <option value="difficulty">Difficulty</option>
              </select>
            </div>

            {/* Filter select */}
            <div>
              <label htmlFor="filter" className="mb-2 block dark:text-gray-200">
                Filter By
              </label>
              <select
                id="filter"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="w-full rounded-md border px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                title="Filter By"
              >
                <option value="all">All Factions</option>
                <option value="solaris">Solaris Nexus</option>
                <option value="umbral">Umbral Eclipse</option>
                <option value="aeonic">Aeonic Dominion</option>
                <option value="primordial">Primordial Genesis</option>
                <option value="infernal">Infernal Core</option>
                <option value="neuralis">Neuralis Conclave</option>
                <option value="synthetic">Synthetic Directive</option>
                <option value="energy">Energy Manipulation</option>
                <option value="stealth">Stealth</option>
                <option value="time">Time Manipulation</option>
                <option value="mind">Mind Control</option>
                <option value="adaptation">Adaptation</option>
                <option value="sacrifice">Sacrifice</option>
              </select>
            </div>
          </div>

          {/* Results count and clear filters */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm dark:text-gray-300">
              Showing {sortedFactions.length} of {factions.length} factions
            </p>
            {(searchQuery || filterBy !== "all" || sortBy !== "name") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setFilterBy("all");
                  setSortBy("name");
                }}
                className="dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Faction grid */}
      {sortedFactions.length > 0 ? (
        <FactionGrid
          factions={sortedFactions}
          onFactionClick={handleFactionClick}
        />
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No factions found
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
}
