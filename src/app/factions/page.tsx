import { FactionGridWrapper } from "@/components/factions/FactionGridWrapper";
import { getFactions } from "@/lib/data";

// Make this page static with revalidation every hour
export const revalidate = 3600;

export const metadata = {
  title: 'Factions',
  description: 'Explore the different factions in the game',
};

export default async function FactionsPage() {
  // Fetch faction data
  const factions = await getFactions();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Factions</h1>
      <FactionGridWrapper factions={factions} />
    </div>
  );
}