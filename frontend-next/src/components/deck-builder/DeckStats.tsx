import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isValidRarity } from '@/lib/card-utils';
import { rarityBadgeClass } from '@/lib/ui-maps';
import { cn } from '@/lib/utils';
import { DeckStats as DeckStatsType, DeckValidationResult } from '@/types/card';
import { AlertCircle, AlertTriangle, BarChart3, CheckCircle, PieChart } from 'lucide-react';
import type { CSSProperties } from 'react';

type CSSVars = CSSProperties & Record<string, string | number>;

interface DeckStatsProps {
  stats: DeckStatsType;
  validation: DeckValidationResult;
  className?: string;
}

/**
 * DeckStats component - Displays deck composition statistics and validation
 * Following Single Responsibility Principle - focused on stats display
 */
export const DeckStats = ({
  stats,
  validation,
  className,
}: DeckStatsProps) => {
  // Cost curve visualization data
  const maxCostCount = Math.max(...Object.values(stats.costCurve), 1);
  const costCurveData = Array.from({ length: 11 }, (_, cost) => ({
    cost,
    count: stats.costCurve[cost] || 0,
    percentage: ((stats.costCurve[cost] || 0) / maxCostCount) * 100,
  }));

  // We're now using the imported isValidRarity function from card-utils

  return (
    <div className={cn('space-y-4', className)}>
      {/* Validation Status */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {validation.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <CardTitle className="text-lg">
              Deck Validation
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Card Count */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Cards:</span>
            <Badge variant={validation.cardCount >= 30 && validation.cardCount <= 50 ? "default" : "destructive"}>
              {validation.cardCount}/30-50
            </Badge>
          </div>
          {/* Validation Errors */}
          {validation.errors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Errors</span>
              </div>
              <ul className="space-y-1">
                {validation.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-300 pl-6">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Validation Warnings */}
          {validation.warnings.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">Warnings</span>
              </div>
              <ul className="space-y-1">
                {validation.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-yellow-300 pl-6">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Success State */}
          {validation.isValid && validation.errors.length === 0 && (
            <div className="text-green-400 text-sm">
              ✓ Deck is valid and ready to play!
            </div>
          )}
        </CardContent>
      </Card>
      {/* Deck Statistics */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{stats.totalCards}</div>
              <div className="text-sm text-gray-400">Total Cards</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{stats.averageCost.toFixed(1)}</div>
              <div className="text-sm text-gray-400">Avg Cost</div>
            </div>
          </div>
          {/* Type Distribution */}
          {Object.keys(stats.typeDistribution).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <PieChart className="w-4 h-4" />
                Card Types
              </h4>
              <div className="space-y-2">
                {Object.entries(stats.typeDistribution).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 capitalize">{type}:</span>
                    <span className="text-sm text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Rarity Distribution */}
          {Object.keys(stats.rarityDistribution).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Rarity Distribution</h4>
              <div className="space-y-2">
                {Object.entries(stats.rarityDistribution).map(([rarity, count]) => (
                  <div key={rarity} className="flex justify-between items-center">
                    <Badge
                      variant={isValidRarity(rarity) ? 'secondary' : 'default'}
                      className={cn('text-xs', rarityBadgeClass(rarity))}
                    >
                      {rarity}
                    </Badge>
                    <span className="text-sm text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Cost Curve */}
      <Card className="bg-slate-800/50 border-slate-600">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Cost Curve</CardTitle>
          <CardDescription className="text-gray-400">
            Distribution of cards by mana cost
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {costCurveData.slice(0, 8).map(({ cost, count, percentage }) => (
              <div key={cost} className="flex items-center gap-3">
                <div className="w-6 text-sm text-gray-400 text-right">
                  {cost === 7 ? '7+' : cost}
                </div>
                <div
                  className="flex-1 bg-slate-700 rounded-full h-6 overflow-hidden"
                  style={{ '--cost-bar-w': `${Math.max(percentage, count > 0 ? 10 : 0)}%` } as CSSVars}
                >
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300 flex items-center justify-center w-cost-bar"
                  >
                    {count > 0 && (
                      <span className="text-xs font-medium text-white">
                        {count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

DeckStats.displayName = 'DeckStats';