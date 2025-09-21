"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card as CardType } from "@/types/card";
import { FACTION_IDS, FactionId } from "@/types/faction";
import { Filter, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
const CardItem = dynamic(() => import("./CardItem").then(m => m.CardItem), { ssr: false });
const CardFiltersPanel = dynamic(() => import("./CardFiltersPanel"), { ssr: false });

interface CardGridProps {
  cards: CardType[];
  onAddCard: (card: CardType) => void;
  onSelectCard?: (card: CardType) => void;
  selectedCardId?: string | null;
}

export function CardGrid({
  cards,
  onAddCard,
  onSelectCard,
  selectedCardId,
}: CardGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFaction, setSelectedFaction] = useState<FactionId | "all">(
    "all",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCosts, setSelectedCosts] = useState<number[]>([]);

  // Extract unique card types and costs for filters
  const { types, costs } = useMemo(() => {
    const typeSet = new Set<string>();
    const costSet = new Set<number>();

    cards.forEach((card) => {
      typeSet.add(card.type);
      costSet.add(card.cost);
    });

    return {
      types: Array.from(typeSet).sort(),
      costs: Array.from(costSet).sort((a, b) => a - b),
    };
  }, [cards]);

  // Filter cards based on search and filters
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      // Search term filter
      const matchesSearch =
        card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.type.toLowerCase().includes(searchTerm.toLowerCase());

      // Faction filter
      const matchesFaction =
        selectedFaction === "all" || card.faction === selectedFaction;

      // Type filter
      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(card.type);

      // Cost filter
      const matchesCost =
        selectedCosts.length === 0 || selectedCosts.includes(card.cost);

      return matchesSearch && matchesFaction && matchesType && matchesCost;
    });
  }, [cards, searchTerm, selectedFaction, selectedTypes, selectedCosts]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const toggleCost = (cost: number) => {
    setSelectedCosts((prev) =>
      prev.includes(cost) ? prev.filter((c) => c !== cost) : [...prev, cost],
    );
  };

  const clearFilters = () => {
    setSelectedFaction("all");
    setSelectedTypes([]);
    setSelectedCosts([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search cards..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select
            value={selectedFaction}
            onChange={(e) =>
              setSelectedFaction(e.target.value as FactionId | "all")
            }
            className="w-[180px]"
          >
            <option value="all">All Factions</option>
            {FACTION_IDS.map((factionId) => (
              <option key={factionId} value={factionId}>
                {factionId.replace(/-/g, " ")}
              </option>
            ))}
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <CardFiltersPanel
          types={types}
          costs={costs}
          selectedTypes={selectedTypes}
          selectedCosts={selectedCosts}
          onToggleType={toggleType}
          onToggleCost={toggleCost}
          onClearFilters={clearFilters}
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onAdd={() => onAddCard(card)}
            onClick={onSelectCard}
            className={
              card.id === selectedCardId
                ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900"
                : undefined
            }
            showAddButton
            draggable
          />
        ))}
      </div>

      {filteredCards.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No cards found matching your search.</p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="mt-2"
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
