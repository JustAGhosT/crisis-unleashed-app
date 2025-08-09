/**
 * @deprecated - This page should be migrated to frontend-next/src/app/factions/page.tsx
 * This is a temporary wrapper that uses the FactionGridWrapper
 */
import { FactionGridWrapper } from "@/components/factions/FactionGridWrapper";

// Import directly from frontend-next where possible
import { fetchFactions } from "@/services/factionService";

// Make this page static with revalidation every hour
export const revalidate = 3600;

export const metadata = {
  title: 'Factions',
  description: 'Explore the different factions in the game',
};

export default async function FactionsPage() {
  // Use the existing data fetching for now
  // This should eventually be replaced with frontend-next data fetching
  const factionsResponse = await fetchFactions();
  const factions = factionsResponse.success ? factionsResponse.data : [];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Factions</h1>
      <FactionGridWrapper factions={factions} />
    </div>
  );
}