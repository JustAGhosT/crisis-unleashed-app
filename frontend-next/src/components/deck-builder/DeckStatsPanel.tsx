"use client";

import React, { useMemo } from "react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Deck } from "@/types/deck";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface DeckStatsPanelProps {
  deck: Deck;
}

export default function DeckStatsPanel({ deck }: DeckStatsPanelProps) {
  // Calculate cost distribution
  const costDistribution = useMemo(() => {
    const distribution: Record<number, number> = {};

    deck.cards.forEach((card) => {
      if (card.cost !== undefined) {
        // Group all costs 7+ into a "7+" category
        const costKey = card.cost >= 7 ? 7 : card.cost;
        distribution[costKey] = (distribution[costKey] || 0) + 1;
      }
    });

    // Convert to array for chart
    return Object.entries(distribution)
      .map(([cost, count]) => ({
        cost: cost === "7" ? "7+" : cost,
        count,
        costValue: parseInt(cost, 10), // For sorting
      }))
      .sort((a, b) => a.costValue - b.costValue);
  }, [deck.cards]);

  // Calculate card type distribution
  const typeDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};

    deck.cards.forEach((card) => {
      const type = card.type || "Unknown";
      distribution[type] = (distribution[type] || 0) + 1;
    });

    // Convert to array for chart
    return Object.entries(distribution)
      .map(([type, count]) => ({
        type,
        count,
        percentage: Math.round((count / deck.cards.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [deck.cards]);

  // Calculate rarity distribution
  const rarityDistribution = useMemo(() => {
    const distribution: Record<string, number> = {};

    deck.cards.forEach((card) => {
      const rarity = card.rarity || "Unknown";
      distribution[rarity] = (distribution[rarity] || 0) + 1;
    });

    // Convert to array for chart
    return Object.entries(distribution)
      .map(([rarity, count]) => ({
        rarity,
        count,
        percentage: Math.round((count / deck.cards.length) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [deck.cards]);

  // Colors for pie charts
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
  ];

  // Calculate average cost
  const averageCost = useMemo(() => {
    const cardsWithCost = deck.cards.filter((card) => card.cost !== undefined);
    if (cardsWithCost.length === 0) return 0;

    const totalCost = cardsWithCost.reduce(
      (sum, card) => sum + (card.cost || 0),
      0,
    );
    return (totalCost / cardsWithCost.length).toFixed(2);
  }, [deck.cards]);

  // Calculate average power
  const averagePower = useMemo(() => {
    const cardsWithPower = deck.cards.filter(
      (card) => card.power !== undefined,
    );
    if (cardsWithPower.length === 0) return 0;

    const totalPower = cardsWithPower.reduce(
      (sum, card) => sum + (card.power || 0),
      0,
    );
    return (totalPower / cardsWithPower.length).toFixed(2);
  }, [deck.cards]);

  return (
    <>
      <CardHeader>
        <CardTitle className="dark:text-white">Deck Statistics</CardTitle>
        <CardDescription className="dark:text-gray-400">
          Analyze your deck composition and balance
        </CardDescription>
      </CardHeader>

      <CardContent>
        {deck.cards.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              No cards in deck
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Add cards to see deck statistics
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Cards
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {deck.cards.length}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Unique Cards
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {new Set(deck.cards.map((card) => card.id)).size}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg. Cost
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {averageCost}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Avg. Power
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {averagePower}
                </p>
              </div>
            </div>

            {/* Cost distribution chart */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Cost Distribution
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={costDistribution}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <XAxis
                      dataKey="cost"
                      tick={{ fill: "var(--chart-text-color, #4b5563)" }}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "var(--chart-text-color, #4b5563)" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--tooltip-bg, white)",
                        borderColor: "var(--tooltip-border, #e5e7eb)",
                        color: "var(--tooltip-text, black)",
                      }}
                    />
                    <Bar
                      dataKey="count"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                      name="Cards"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Type and Rarity distribution charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Type distribution */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Card Types
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={typeDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="type"
                        label={({ type, percentage }) =>
                          `${type}: ${percentage}%`
                        }
                      >
                        {typeDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        formatter={(
                          value: number | string,
                          name: string,
                          entry: { payload?: { percentage?: number } },
                        ) => {
                          const pct = entry?.payload?.percentage ?? 0;
                          return [`${value} cards (${pct}%)`, name];
                        }}
                        contentStyle={{
                          backgroundColor: "var(--tooltip-bg, white)",
                          borderColor: "var(--tooltip-border, #e5e7eb)",
                          color: "var(--tooltip-text, black)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Rarity distribution */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  Card Rarities
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rarityDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="rarity"
                        label={({ rarity, percentage }) =>
                          `${rarity}: ${percentage}%`
                        }
                      >
                        {rarityDistribution.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip
                        formatter={(
                          value: number | string,
                          name: string,
                          entry: { payload?: { percentage?: number } },
                        ) => {
                          const pct = entry?.payload?.percentage ?? 0;
                          return [`${value} cards (${pct}%)`, name];
                        }}
                        contentStyle={{
                          backgroundColor: "var(--tooltip-bg, white)",
                          borderColor: "var(--tooltip-border, #e5e7eb)",
                          color: "var(--tooltip-text, black)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </>
  );
}
