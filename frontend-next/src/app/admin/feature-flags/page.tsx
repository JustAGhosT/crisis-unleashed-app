"use client";


import { useFeatureFlags } from "@/lib/feature-flags/feature-flag-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function FeatureFlagAdmin() {
  const { flags, setFlag } = useFeatureFlags();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Feature Flag Administration</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <FeatureFlagCard
          title="Faction UI"
          description="New faction cards and detail pages"
          flagKey="useNewFactionUI"
          enabled={flags.useNewFactionUI}
          setFlag={setFlag}
        />
        <FeatureFlagCard
          title="Deck Builder"
          description="New deck builder interface with improved UX"
          flagKey="useNewDeckBuilder"
          enabled={flags.useNewDeckBuilder}
          setFlag={setFlag}
        />
        <FeatureFlagCard
          title="Card Display"
          description="Redesigned card layout and animations"
          flagKey="useNewCardDisplay"
          enabled={flags.useNewCardDisplay}
          setFlag={setFlag}
        />
        <FeatureFlagCard
          title="Navigation"
          description="New header and navigation components"
          flagKey="useNewNavigation"
          enabled={flags.useNewNavigation}
          setFlag={setFlag}
        />
        <FeatureFlagCard
          title="Theme System"
          description="New theming with dark/light mode support"
          flagKey="useNewTheme"
          enabled={flags.useNewTheme}
          setFlag={setFlag}
        />
      </div>

      <div className="mt-6 flex gap-4">
        <Button
          variant="default"
          onClick={() => {
            Object.keys(flags).forEach((key) => {
              setFlag(key as keyof typeof flags, true);
            });
          }}
        >
          Enable All
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            Object.keys(flags).forEach((key) => {
              setFlag(key as keyof typeof flags, false);
            });
          }}
        >
          Disable All
        </Button>
      </div>
    </div>
  );
}

function FeatureFlagCard({
  title,
  description,
  flagKey,
  enabled,
  setFlag,
}: {
  title: string;
  description: string;
  flagKey: keyof ReturnType<typeof useFeatureFlags>["flags"];
  enabled: boolean;
  setFlag: ReturnType<typeof useFeatureFlags>["setFlag"];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="font-medium">{enabled ? "Enabled" : "Disabled"}</span>
          <Switch
            checked={enabled}
            onCheckedChange={(checked: boolean) => setFlag(flagKey, checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}