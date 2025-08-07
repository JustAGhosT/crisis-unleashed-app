import { notFound } from 'next/navigation';
import Image from 'next/image';
import { fetchFactionById, getFactionIds } from '@/services/factionService';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { FactionId } from '@/types/faction';

// Tailwind class maps per faction
const factionTextColorMap: Record<FactionId, string> = {
  solaris: "text-yellow-400",
  umbral: "text-purple-400",
  neuralis: "text-cyan-400",
  aeonic: "text-emerald-400",
  infernal: "text-red-400",
  primordial: "text-green-600",
  synthetic: "text-gray-400", // placeholder for possible future faction
};

const factionBgColorMap: Record<FactionId, string> = {
  solaris: "bg-yellow-400",
  umbral: "bg-purple-400",
  neuralis: "bg-cyan-400",
  aeonic: "bg-emerald-400",
  infernal: "bg-red-400",
  primordial: "bg-green-600",
  synthetic: "bg-gray-400", // placeholder for possible future faction
};

// Lookup maps for display
const playStyles: Record<FactionId, string> = {
  solaris: "Aggressive, Control",
  umbral: "Stealth, Sabotage",
  neuralis: "Adaptive, Technical",
  aeonic: "Combo, Control",
  infernal: "Aggressive, Damage",
  primordial: "Ramp, Swarm",
  synthetic: "Technical, Adaptive",
};
const difficulties: Record<FactionId, string> = {
  solaris: "★★☆☆☆ (Beginner)",
  umbral: "★★★☆☆ (Intermediate)",
  neuralis: "★★★★☆ (Advanced)",
  aeonic: "★★★★★ (Expert)",
  infernal: "★★☆☆☆ (Beginner)",
  primordial: "★★★☆☆ (Intermediate)",
  synthetic: "★★★☆☆ (Intermediate)",
};
const synergies: Record<FactionId, string> = {
  solaris: "Strong with Infernal, weak against Umbral",
  umbral: "Strong with Neuralis, weak against Primordial",
  neuralis: "Strong with Aeonic, weak against Solaris",
  aeonic: "Strong with Umbral, weak against Infernal",
  infernal: "Strong with Solaris, weak against Primordial",
  primordial: "Strong with Infernal, weak against Neuralis",
  synthetic: "Strong with Neuralis, weak against Aeonic",
};

export async function generateStaticParams() {
  const factionIds = await getFactionIds();
  return factionIds.map(id => ({ id }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const factionResponse = await fetchFactionById(params.id as FactionId);
  const faction = factionResponse.success ? factionResponse.data : null;
  if (!faction) {
    return { title: 'Faction Not Found' };
  }
  return {
    title: faction.name,
    description: faction.description,
  };
}

export default async function FactionPage({ params }: { params: { id: string } }) {
  const factionResponse = await fetchFactionById(params.id as FactionId);
  const faction = factionResponse.success ? factionResponse.data : null;
  if (!faction) {
    notFound();
  }
  // Typescript non-null assertion safe due to notFound() guard
  return (
    <div className="container mx-auto py-8">
      <div className="relative h-64 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={`/images/factions/${faction.id}-banner.jpg`}
          alt={`${faction.name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center">
          <div className="bg-background/60 p-2 rounded-full mr-4">
            <Image
              src={`/images/factions/${faction.id}-logo.svg`}
              alt={`${faction.name} logo`}
              width={60}
              height={60}
              className="rounded-full"
            />
          </div>
          <h1
            className={`text-4xl font-bold drop-shadow-lg ${factionTextColorMap[faction.id] ?? ""}`}
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
                {Object.keys(faction.mechanics ?? {}).map((mechanic) => (
                  <Badge key={mechanic} variant="secondary" className="text-sm py-1 px-3">
                    {mechanic}
                  </Badge>
                ))}
              </div>
              <h3 className="text-xl font-semibold mb-3">Strategy</h3>
              <p className="mb-4">
                Playing as the {faction.name} requires understanding their unique strengths and mechanics.
                {faction.strength && (
                  <span> {faction.strength}</span>
                )}
              </p>
              <p>
                {faction.philosophy && (
                  <span>{faction.philosophy}</span>
                )}
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
                      className={`h-6 w-6 rounded-full mr-2 border ${factionBgColorMap[faction.id] ?? "bg-gray-300"}`}
                    />
                    <span>{faction.colors.primary}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Play Style</h3>
                  <p className="mt-1">{playStyles[faction.id] || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Difficulty</h3>
                  <p className="mt-1">{difficulties[faction.id] || "Unknown"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Synergies</h3>
                  <p className="mt-1">{synergies[faction.id] || "Unknown"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}