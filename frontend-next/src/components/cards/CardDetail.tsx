import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card as GameCardData, CardRarity } from '@/types/card';
import { cn, getFactionColorClass, getFactionGradientClass } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Shield, Sword, Zap, Flag, Sparkles, Star, Clock } from 'lucide-react';

interface CardDetailProps {
  card: GameCardData;
  onAddToDeck?: (card: GameCardData) => void;
  onToggleFavorite?: (card: GameCardData, isFavorite: boolean) => void;
  ownedQuantity?: number;
  isFavorite?: boolean;
  className?: string;
}

/**
 * CardDetail component - Displays detailed information about a card
 * Following SOLID principles with clear separation of concerns
 */
export const CardDetail: React.FC<CardDetailProps> = ({
  card,
  onAddToDeck,
  onToggleFavorite,
  ownedQuantity = 0,
  isFavorite = false,
  className,
}) => {
  const rarityColors: Record<CardRarity, string> = {
    common: 'bg-gray-400',
    uncommon: 'bg-green-400',
    rare: 'bg-blue-400',
    epic: 'bg-purple-400',
    legendary: 'bg-amber-400',
  };

  return (
    <Card className={cn(
      'overflow-hidden border-2',
      getFactionColorClass(card.faction),
      'bg-slate-800/80 backdrop-blur-sm',
      className
    )}>
      <div className={cn(
        'p-6 relative',
        getFactionGradientClass(card.faction),
      )}>
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          {/* Card Image */}
          <div className="w-full md:w-1/3 aspect-[3/4] bg-slate-900/60 rounded-lg overflow-hidden border border-white/20 shadow-lg">
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.name}
                width={300}
                height={400}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className={cn(
                  'text-lg font-bold opacity-40',
                  getFactionColorClass(card.faction)
                )}>
                  {card.name}
                </div>
              </div>
            )}
          </div>
          
          {/* Card Header Information */}
          <div className="w-full md:w-2/3 text-white">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn(
                'px-2 py-1 rounded text-xs font-semibold',
                'bg-gray-700/50 backdrop-blur-sm'
              )}>
                {card.type.toUpperCase()}
                {card.unitType && ` - ${card.unitType}`}
                {card.actionType && ` - ${card.actionType}`}
                {card.structureType && ` - ${card.structureType}`}
              </div>
              
              <Badge className={cn(
                'text-black',
                rarityColors[card.rarity]
              )}>
                {card.rarity}
              </Badge>
              
              <Badge variant="outline" className="text-white border-white/30">
                {card.faction}
              </Badge>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{card.name}</h1>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex items-center gap-1">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-bold',
                  'bg-blue-600/70 backdrop-blur-sm text-white'
                )}>
                  {card.cost}
                </div>
                <span className="text-sm text-blue-200">Cost</span>
              </div>
              
              {card.attack !== undefined && (
                <div className="flex items-center gap-1">
                  <Sword className="w-5 h-5 text-orange-400" />
                  <span className="font-bold">{card.attack}</span>
                  <span className="text-sm text-orange-200">Attack</span>
                </div>
              )}
              
              {card.health !== undefined && (
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="font-bold">{card.health}</span>
                  <span className="text-sm text-red-200">Health</span>
                </div>
              )}
              
              {card.initiative !== undefined && (
                <div className="flex items-center gap-1">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold">{card.initiative}</span>
                  <span className="text-sm text-yellow-200">Initiative</span>
                </div>
              )}
              
              {card.energyCost > 0 && (
                <div className="flex items-center gap-1">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="font-bold">{card.energyCost}</span>
                  <span className="text-sm text-purple-200">Energy</span>
                </div>
              )}
            </div>
            
            <p className="text-gray-200 mb-4">{card.description}</p>
            
            {card.abilities && card.abilities.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm text-gray-300 mb-2">Abilities:</h3>
                <div className="flex flex-wrap gap-2">
                  {card.abilities.map((ability, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-700/50 text-white">
                      {ability}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {card.keywords && card.keywords.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-300 mb-2">Keywords:</h3>
                <div className="flex flex-wrap gap-2">
                  {card.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="border-white/30">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Detailed Information Tabs */}
      <Tabs defaultValue="gameplay" className="w-full">
        <div className="px-6 border-b border-slate-700">
          <TabsList className="bg-transparent border-b-0">
            <TabsTrigger value="gameplay" className="data-[state=active]:bg-slate-700/50">Gameplay</TabsTrigger>
            <TabsTrigger value="lore" className="data-[state=active]:bg-slate-700/50">Lore</TabsTrigger>
            <TabsTrigger value="collection" className="data-[state=active]:bg-slate-700/50">Collection</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="gameplay" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Gameplay Details</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                {card.playConditions && card.playConditions.length > 0 && (
                  <li className="flex items-start gap-2">
                    <Flag className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-white">Play Conditions:</span>
                      <ul className="list-disc list-inside pl-2 mt-1">
                        {card.playConditions.map((condition, index) => (
                          <li key={index}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )}
                
                {card.zoneRestrictions && card.zoneRestrictions.length > 0 && (
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-white">Zone Restrictions:</span>
                      <ul className="list-disc list-inside pl-2 mt-1">
                        {card.zoneRestrictions.map((zone, index) => (
                          <li key={index}>{zone}</li>
                        ))}
                      </ul>
                    </div>
                  </li>
                )}
                
                {card.movementSpeed !== undefined && (
                  <li className="flex items-center gap-2">
                    <span className="font-medium text-white">Movement Speed:</span>
                    <span>{card.movementSpeed}</span>
                  </li>
                )}
                
                {card.range !== undefined && (
                  <li className="flex items-center gap-2">
                    <span className="font-medium text-white">Range:</span>
                    <span>{card.range}</span>
                  </li>
                )}
                
                {card.persistsOnBattlefield !== undefined && (
                  <li className="flex items-center gap-2">
                    <span className="font-medium text-white">Persists On Battlefield:</span>
                    <span>{card.persistsOnBattlefield ? 'Yes' : 'No'}</span>
                  </li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Synergies</h3>
              <p className="text-sm text-gray-300 mb-4">
                This card works well with other {card.faction} cards that focus on 
                {card.keywords?.includes('Quick Attack') && ' quick attacks and initiative control'}
                {card.keywords?.includes('Overwhelm') && ' overwhelming the opponent\'s defenses'}
                {card.keywords?.includes('Shield') && ' defensive strategies'}
                {!card.keywords && ' various strategies'}.
              </p>
              
              <h3 className="text-lg font-semibold mb-3">Counter Strategies</h3>
              <p className="text-sm text-gray-300">
                This card can be countered by 
                {card.type === 'unit' && ' removal spells and high attack units'}
                {card.type === 'action' && ' counter spells and anticipatory play'}
                {card.type === 'structure' && ' structure destruction effects'}
                {card.type === 'hero' && ' control effects and focused attacks'}.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="lore" className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Card Story</h3>
              <p className="text-sm text-gray-300">
                {card.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Faction Context</h3>
              <p className="text-sm text-gray-300">
                As a {card.faction} card, {card.name} embodies the faction&apos;s principles of 
                {card.faction === 'solaris' && ' light, energy, and direct power.'}
                {card.faction === 'umbral' && ' shadow, stealth, and manipulation.'}
                {card.faction === 'aeonic' && ' time, control, and strategic foresight.'}
                {card.faction === 'primordial' && ' nature, growth, and adaptation.'}
                {card.faction === 'infernal' && ' fire, destruction, and overwhelming force.'}
                {card.faction === 'neuralis' && ' mind, technology, and analytical precision.'}
                {card.faction === 'synthetic' && ' artificial intelligence, adaptation, and optimization.'}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">World Placement</h3>
              <p className="text-sm text-gray-300">
                This card represents an important element in the Crisis Unleashed universe, showing the 
                {card.type === 'hero' && ' legendary heroes who lead their factions into battle.'}
                {card.type === 'unit' && ' diverse forces that fight for their faction\'s cause.'}
                {card.type === 'action' && ' tactical abilities and strategic options available.'}
                {card.type === 'structure' && ' permanent structures that shape the battlefield.'}
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="collection" className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold">Collection Status</h3>
                <p className="text-sm text-gray-300">
                  You own <span className="font-bold text-white">{ownedQuantity}</span> copies of this card.
                </p>
              </div>
              
              <div className="flex gap-2">
                {onToggleFavorite && (
                  <Button
                    variant="outline"
                    onClick={() => onToggleFavorite(card, !isFavorite)}
                    className={cn(
                      "flex items-center gap-2",
                      isFavorite && "bg-amber-500/10 border-amber-500 text-amber-500"
                    )}
                  >
                    <Star className="w-4 h-4" />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                )}
                
                {onAddToDeck && (
                  <Button
                    onClick={() => onAddToDeck(card)}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Add to Deck
                  </Button>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold mb-2">Card Details</h3>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex justify-between">
                    <span className="text-gray-400">Card ID:</span>
                    <span className="font-mono">{String(card.id).slice(0, 8)}…</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Rarity:</span>
                    <span>{card.rarity}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span>{card.type}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Faction:</span>
                    <span>{card.faction}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-400">Released:</span>
                    <span>{formatDistanceToNow(new Date(card.createdAt), { addSuffix: true })}</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-semibold mb-2">Acquisition</h3>
                <p className="text-xs text-gray-300 mb-2">
                  This card can be acquired through:
                </p>
                <ul className="list-disc list-inside text-xs text-gray-300 space-y-1">
                  <li>Card packs ({card.rarity} tier)</li>
                  <li>Crafting with {getRarityCost(card.rarity)} essence</li>
                  <li>Trading with other players</li>
                  {card.rarity === 'legendary' && (
                    <li>Special promotional events</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

// Helper function to get crafting cost based on rarity
const getRarityCost = (rarity: CardRarity): number => {
  switch (rarity) {
    case 'common': return 100;
    case 'uncommon': return 300;
    case 'rare': return 800;
    case 'epic': return 1600;
    case 'legendary': return 3200;
  }
};

CardDetail.displayName = 'CardDetail';