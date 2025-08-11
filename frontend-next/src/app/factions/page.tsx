import { EnhancedFactionGrid } from "@/components/factions/EnhancedFactionGrid";
import { getFactions } from "@/services/factionService";

// Make this page static with revalidation every hour
export const revalidate = 3600;

export const metadata = {
  title: 'Factions',
  description: 'Explore the different factions in the game',
};

export default async function FactionsPage() {
  // Use the existing data fetching for now
  // This should eventually be replaced with frontend-next data fetching
  const factions = await getFactions();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Factions</h1>

      <EnhancedFactionGrid 
        factions={factions} 
        title="Choose Your Faction"
        description="Each faction in Crisis Unleashed has unique abilities, strengths, and playstyles. Explore them all to find your perfect match."
      />
    </div>
  );
}