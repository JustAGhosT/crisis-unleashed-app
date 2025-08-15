import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  fetchFactionById,
  getFactionIds,
  getFactionTextColor,
  getFactionBgColor,
  getFactionPlayStyle,
  getFactionDifficulty,
  getFactionSynergies,
} from "@/services/factionService";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FactionId } from "@/types/faction";
import { FeatureGate } from "@/components/feature-flags/FeatureGate";
import FactionsThemeShell from "../FactionsThemeShell";

export async function generateStaticParams() {
  const factionIds = await getFactionIds();
  return factionIds.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const factionResponse = await fetchFactionById(id as FactionId);
  const faction = factionResponse.success ? factionResponse.data : null;
  if (!faction) {
    return { title: "Faction Not Found" };
  }
  return {
    title: faction.name,
    description: faction.description,
  };
}

export default async function FactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const factionResponse = await fetchFactionById(id as FactionId);
  const faction = factionResponse.success ? factionResponse.data : null;
  if (!faction) {
    notFound();
  }

  // Get faction metadata from service
  const textColorClass = getFactionTextColor(faction.id);
  const bgColorClass = getFactionBgColor(faction.id);
  const playStyle = getFactionPlayStyle(faction.id);
  const difficulty = getFactionDifficulty(faction.id);
  const synergy = getFactionSynergies(faction.id);

  // Legacy faction detail view
  const LegacyFactionDetail = () => (
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
          <h1 className={`text-4xl font-bold drop-shadow-lg ${textColorClass}`}>
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
                  <Badge
                    key={mechanic}
                    variant="secondary"
                    className="text-sm py-1 px-3"
                  >
                    {mechanic}
                  </Badge>
                ))}
              </div>
              <h3 className="text-xl font-semibold mb-3">Strategy</h3>
              <p className="mb-4">
                Playing as the {faction.name} requires understanding their
                unique strengths and mechanics.
                {faction.strength && <span> {faction.strength}</span>}
              </p>
              <p>{faction.philosophy && <span>{faction.philosophy}</span>}</p>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Faction Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Faction Color
                  </h3>
                  <div className="mt-1 flex items-center">
                    <div
                      className={`h-6 w-6 rounded-full mr-2 border ${bgColorClass}`}
                    />
                    <span>{faction.colors.primary}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Play Style
                  </h3>
                  <p className="mt-1">{playStyle}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Difficulty
                  </h3>
                  <p className="mt-1">{difficulty}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Synergies
                  </h3>
                  <p className="mt-1">{synergy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  // Enhanced faction detail view with dark mode support and additional features
  const EnhancedFactionDetail = () => (
    <div className="container mx-auto py-8">
      {/* Hero section with faction banner and logo */}
      <div className="relative h-80 w-full mb-8 rounded-lg overflow-hidden">
        <Image
          src={`/images/factions/${faction.id}-banner.jpg`}
          alt={`${faction.name} banner`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent dark:from-gray-900/90" />
        <div className="absolute bottom-6 left-6 flex items-center">
          <div
            className={`p-2 rounded-full mr-4 ${bgColorClass} bg-opacity-20 dark:bg-opacity-30`}
          >
            <Image
              src={`/images/factions/${faction.id}-logo.svg`}
              alt={`${faction.name} logo`}
              width={80}
              height={80}
              className="rounded-full"
            />
          </div>
          <div>
            <h1
              className={`text-4xl font-bold drop-shadow-lg ${textColorClass}`}
            >
              {faction.name}
            </h1>
            <p className="text-white text-lg mt-1 max-w-xl drop-shadow-md">
              {faction.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation and action buttons */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/factions">
            <Button
              variant="outline"
              className="dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              ← Back to Factions
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={`border-current ${textColorClass} hover:bg-current/10`}
          >
            Build Deck
          </Button>
          <Button
            className={`${bgColorClass} text-white hover:${bgColorClass} hover:brightness-110`}
          >
            Select Faction
          </Button>
        </div>
      </div>

      {/* Tabbed content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start mb-6 dark:bg-gray-800">
          <TabsTrigger
            value="overview"
            className="dark:data-[state=active]:bg-gray-700"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="strategy"
            className="dark:data-[state=active]:bg-gray-700"
          >
            Strategy
          </TabsTrigger>
          <TabsTrigger
            value="cards"
            className="dark:data-[state=active]:bg-gray-700"
          >
            Cards
          </TabsTrigger>
          <TabsTrigger
            value="lore"
            className="dark:data-[state=active]:bg-gray-700"
          >
            Lore
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                    Faction Overview
                  </h2>
                  <p className="text-lg mb-6 dark:text-gray-300">
                    {faction.description}
                  </p>

                  <h3 className="text-xl font-semibold mb-3 dark:text-white">
                    Key Mechanics
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {Object.keys(faction.mechanics ?? {}).map((mechanic) => (
                      <Badge
                        key={mechanic}
                        variant="secondary"
                        className={`text-sm py-1 px-3 ${textColorClass} bg-opacity-20 dark:bg-opacity-30`}
                      >
                        {mechanic}
                      </Badge>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3 dark:text-white">
                        Philosophy
                      </h3>
                      <p className="dark:text-gray-300">{faction.philosophy}</p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-3 dark:text-white">
                        Strengths
                      </h3>
                      <p className="dark:text-gray-300">{faction.strength}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                    Faction Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium dark:text-gray-400">
                        Faction Color
                      </h3>
                      <div className="mt-1 flex items-center">
                        <div
                          className={`h-6 w-6 rounded-full mr-2 border ${bgColorClass}`}
                        />
                        <span className="dark:text-white">
                          {faction.colors.primary}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium dark:text-gray-400">
                        Play Style
                      </h3>
                      <p className="mt-1 dark:text-white">{playStyle}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium dark:text-gray-400">
                        Difficulty
                      </h3>
                      <p className="mt-1 dark:text-white">{difficulty}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium dark:text-gray-400">
                        Synergies
                      </h3>
                      <p className="mt-1 dark:text-white">{synergy}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium dark:text-gray-400">
                        Technology
                      </h3>
                      <p className="mt-1 dark:text-white">
                        {faction.technology}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Strategy Tab */}
        <TabsContent value="strategy">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                Strategy Guide
              </h2>
              <div className="space-y-6 dark:text-gray-300">
                <p>
                  Playing as the {faction.name} requires understanding their
                  unique strengths and mechanics.
                  {faction.strength && <span> {faction.strength}</span>}
                </p>

                <h3 className="text-xl font-semibold dark:text-white">
                  Early Game
                </h3>
                <p>
                  In the early game, focus on establishing your resource base
                  and deploying key units that synergize with your
                  faction&apos;s mechanics.
                </p>

                <h3 className="text-xl font-semibold dark:text-white">
                  Mid Game
                </h3>
                <p>
                  As the game progresses, leverage your faction&apos;s unique
                  abilities to control the battlefield and counter your
                  opponent&apos;s strategy.
                </p>

                <h3 className="text-xl font-semibold dark:text-white">
                  Late Game
                </h3>
                <p>
                  In the late game, your powerful faction-specific cards can
                  turn the tide of battle when played strategically.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cards Tab */}
        <TabsContent value="cards">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                Faction Cards
              </h2>
              <p className="dark:text-gray-300 mb-6">
                Explore the unique cards available to the {faction.name}{" "}
                faction.
              </p>

              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  Card browser coming soon...
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lore Tab */}
        <TabsContent value="lore">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 dark:text-white">
                Faction Lore
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <p>
                  The {faction.name} emerged during the great cataclysm that
                  reshaped the world. Their unique philosophy of{" "}
                  {faction.philosophy.toLowerCase()} has guided their
                  development and shaped their role in the ongoing conflict.
                </p>

                <p>
                  Known for their {faction.strength.toLowerCase()}, they have
                  carved out a significant presence in the fractured world,
                  using their technological advancements to secure resources and
                  territory.
                </p>

                <p>
                  Their technology focuses on {faction.technology.toLowerCase()}
                  , giving them a unique advantage in certain combat scenarios
                  and making them a formidable force on the battlefield.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Use FeatureGate to conditionally render the new or legacy component
  return (
    <FactionsThemeShell>
      <FeatureGate flag="useNewFactionUI" fallback={<LegacyFactionDetail />}>
        <EnhancedFactionDetail />
      </FeatureGate>
    </FactionsThemeShell>
  );
}
