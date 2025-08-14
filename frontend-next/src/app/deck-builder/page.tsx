"use client";

import { useState, useEffect } from "react";
import { FeatureGate } from "@/components/feature-flags/FeatureGate";
import DeckBuilderInterface from "@/components/deck-builder/DeckBuilderInterface";
import { Skeleton } from "@/components/ui/skeleton";
import RequireAuth from "@/components/auth/RequireAuth";
import FactionsThemeShell from "../factions/FactionsThemeShell";

export default function DeckBuilderPage() {
  const [isLoadingLocal, setIsLoadingLocal] = useState(true);

  // Simulate loading state for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingLocal(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // If still loading, show skeleton
  if (isLoadingLocal) {
    return (
      <div className="py-8">
        <Skeleton className="h-10 w-64 mb-6 bg-slate-700" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full bg-slate-700" />
          </div>
          <div>
            <Skeleton className="h-[600px] w-full bg-slate-700" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <RequireAuth>
      <FactionsThemeShell>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8 dark:text-white">
            Deck Builder
          </h1>
          {/* Deck Builder Feature Gate */}
          <FeatureGate flag="useNewDeckBuilder">
            <DeckBuilderInterface isLoading={isLoadingLocal} />
          </FeatureGate>
        </div>
      </FactionsThemeShell>
    </RequireAuth>
  );
}
