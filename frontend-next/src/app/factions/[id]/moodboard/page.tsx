import { notFound } from "next/navigation";
import MoodBoard from "@/components/factions/MoodBoard";
import { FACTION_KEYS, type FactionKey } from "@/lib/theme/faction-theme";
import { FactionThemeProvider } from "@/lib/theme/theme-context";

export default function FactionMoodBoardPage({ params }: { params: { id: string } }) {
  const id = params.id as FactionKey;
  if (!FACTION_KEYS.includes(id)) return notFound();

  // Provide the theme so the component can read active tokens
  return (
    <FactionThemeProvider initial={id}>
      <div className="container mx-auto py-6">
        <MoodBoard factionId={id} expanded />
      </div>
    </FactionThemeProvider>
  );
}
