import React from "react";

interface DeckSummaryProps {
  uniqueCount: number;
  totalCount: number;
  averageCost: string;
}

export const DeckSummary: React.FC<DeckSummaryProps> = ({
  uniqueCount,
  totalCount,
  averageCost,
}) => (
  <div className="mt-4 pt-4 border-t border-slate-600">
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <div className="text-lg font-semibold text-purple-400">
          {uniqueCount}
        </div>
        <div className="text-xs text-gray-400">Unique Cards</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-blue-400">{totalCount}</div>
        <div className="text-xs text-gray-400">Total Cards</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-green-400">
          {averageCost}
        </div>
        <div className="text-xs text-gray-400">Avg Cost</div>
      </div>
    </div>
  </div>
);

DeckSummary.displayName = "DeckSummary";
