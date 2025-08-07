import { getFactions } from "@/services/factionService";
import { FactionGrid } from "@/components/factions/FactionGrid";

export const revalidate = 3600;
export const metadata = {
  title: "Factions",
  description: "Explore the different factions in the game",
};

export default async function FactionsPage() {
  // Fetch faction data (already in new format)
  const factions = await getFactions();
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Factions</h1>
      <FactionGrid factions={factions} />
    </div>
  );
}