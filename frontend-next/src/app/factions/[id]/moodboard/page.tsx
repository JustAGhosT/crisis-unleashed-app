import { notFound } from "next/navigation";
import MoodBoard from "@/components/factions/MoodBoard";
import { FACTION_KEYS, type FactionKey } from "@/lib/theme/faction-theme";
import { FactionThemeProvider } from "@/lib/theme/theme-context";

const isFactionKey = (v: string): v is FactionKey =>
  (FACTION_KEYS as readonly string[]).includes(v);

export default function FactionMoodBoardPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  if (!isFactionKey(id)) return notFound();
  const factionId: FactionKey = id;

  // Provide the theme so the component can read active tokens
  return (
    <FactionThemeProvider initial={factionId}>
      <div className="container mx-auto py-6">
        <MoodBoard factionId={factionId} expanded />
      </div>
    </FactionThemeProvider>
  );
}
