import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getFaction, getFactionIds } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useFeatureFlags } from '@/lib/feature-flags/feature-flag-provider';

// Generate static pages for known factions
export async function generateStaticParams() {
  const factionIds = await getFactionIds();
  return factionIds.map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const faction = await getFaction(params.id);
  
  if (!faction) {
    return {
      title: 'Faction Not Found',
    };
  }
  
  return {
    title: faction.name,
    description: faction.description,
  };
}

export default async function FactionPage({ params }: { params: { id: string } }) {
  const faction = await getFaction(params.id);
  
  if (!faction) {
    notFound();
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={faction.bannerImage || `/images/factions/${faction.id}-banner.jpg`}
          alt={`${faction.name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        
        <div className="absolute bottom-4 left-4 flex items-center">
          <div className="bg-background/60 p-2 rounded-full mr-4">
            <Image
              src={faction.logo || `/images/factions/${faction.id}-logo.svg`}
              alt={`${faction.name} logo`}
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <h1 
            className="text-4xl font-bold text-white drop-shadow-lg"
            style={{ color: faction.color }}
          >
            {faction.name}
          </h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-lg mb-6">{faction.description}</p>
              
              <h3 className="text-xl font-semibold mb-3">Key Mechanics</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {faction.mechanics?.map((mechanic) => (
                  <Badge key={mechanic} variant="secondary" className="text-sm py-1 px-3">
                    {mechanic}
                  </Badge>
                ))}
              </div>
              
              <h3 className="text-xl font-semibold mb-3">Strategy</h3>
              <p className="mb-4">
                Playing as the {faction.name} requires understanding their unique strengths and mechanics.
                Focus on leveraging {faction.mechanics?.[0]} for early game advantage, then transition into
                {faction.mechanics?.[1]} as you build your resource base.
              </p>
              
              <p>
                In the late game, {faction.mechanics?.[2]} becomes your most powerful tool for closing out
                matches against weakened opponents. Remember that timing is everything with this faction.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Faction Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Faction Color</h3>
                  <div className="mt-1 flex items-center">
                    <div 
                      className="h-6 w-6 rounded-full mr-2" 
                      style={{ backgroundColor: faction.color }}
                    />
                    <span>{faction.color}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Play Style</h3>
                  <p className="mt-1">
                    {faction.id === 'solaris' && 'Aggressive, Control'}
                    {faction.id === 'umbral' && 'Stealth, Sabotage'}
                    {faction.id === 'neuralis' && 'Adaptive, Technical'}
                    {faction.id === 'aeonic' && 'Combo, Control'}
                    {faction.id === 'infernal' && 'Aggressive, Damage'}
                    {faction.id === 'primordial' && 'Ramp, Swarm'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Difficulty</h3>
                  <p className="mt-1">
                    {faction.id === 'solaris' && '★★☆☆☆ (Beginner)'}
                    {faction.id === 'umbral' && '★★★☆☆ (Intermediate)'}
                    {faction.id === 'neuralis' && '★★★★☆ (Advanced)'}
                    {faction.id === 'aeonic' && '★★★★★ (Expert)'}
                    {faction.id === 'infernal' && '★★☆☆☆ (Beginner)'}
                    {faction.id === 'primordial' && '★★★☆☆ (Intermediate)'}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Synergies</h3>
                  <p className="mt-1">
                    {faction.id === 'solaris' && 'Strong with Infernal, weak against Umbral'}
                    {faction.id === 'umbral' && 'Strong with Neuralis, weak against Primordial'}
                    {faction.id === 'neuralis' && 'Strong with Aeonic, weak against Solaris'}
                    {faction.id === 'aeonic' && 'Strong with Umbral, weak against Infernal'}
                    {faction.id === 'infernal' && 'Strong with Solaris, weak against Primordial'}
                    {faction.id === 'primordial' && 'Strong with Infernal, weak against Neuralis'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}