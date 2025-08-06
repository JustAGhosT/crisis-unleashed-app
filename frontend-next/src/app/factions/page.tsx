import { fetchFactions } from "@/services/factionService";
import { FactionGrid } from "@/components/factions/FactionGrid";

// Make this page static with revalidation every hour
export const revalidate = 3600;

export const metadata = {
  title: 'Factions',
  description: 'Explore the different factions in the game',
};

export default async function FactionsPage() {
  // Fetch faction data
  const factionsResponse = await fetchFactions();
  const factions = factionsResponse.success ? factionsResponse.data : [];
  
  // Convert the legacy faction format to the new format for FactionGrid
  const adaptedFactions = factions.map(faction => ({
    id: faction.id as any,
    name: faction.name,
    tagline: faction.description.split('.')[0] || '',
    description: faction.description,
    philosophy: faction.lore || 'Default philosophy',
    strength: faction.playstyle || 'Default strength',
    technology: 'Advanced technology',
    mechanics: Array.isArray(faction.mechanics) 
      ? faction.mechanics.reduce((acc, mechanic) => ({ ...acc, [mechanic]: true }), {})
      : {},
    colors: {
      primary: faction.color,
      secondary: faction.color,
      accent: faction.color
    }
  }));

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Factions</h1>
      <FactionGrid factions={adaptedFactions as any} />
    </div>
  );
}