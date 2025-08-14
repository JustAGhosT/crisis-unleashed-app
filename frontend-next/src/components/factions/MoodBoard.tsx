"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFactionTheme } from "@/lib/theme/theme-context";
import { FACTION_TOKENS, type FactionKey } from "@/lib/theme/faction-theme";
import { getMoodBoardData } from "@/data/factions/moodboard";
import type { ColorPaletteItem, MoodBoardData } from "@/types/moodboard";

export type MoodBoardProps = {
  factionId?: FactionKey; // optional; defaults to active theme
  expanded?: boolean;
  className?: string;
};

export default function MoodBoard({ factionId, expanded = false, className }: MoodBoardProps) {
  const { factionKey } = useFactionTheme();
  const active = factionId ?? factionKey;
  const tokens = FACTION_TOKENS[active] ?? FACTION_TOKENS.default;
  const data: MoodBoardData = getMoodBoardData(active);

  return (
    <div
      data-faction={active}
      className={cn(
        "relative w-full", 
        tokens.mainBg,
        expanded ? "min-h-[80vh]" : "min-h-[60vh]",
        "rounded-xl border border-border/40 p-6 ring-1",
        tokens.ring,
        "overflow-hidden",
        className,
      )}
      style={{
        // allow theme-specific CSS variables if desired later
      }}
    >
      {/* Top/Bottom faction glow */}
      <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b blur-2xl", tokens.glowTop)} />
      <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t blur-2xl", tokens.glowBottom)} />

      <header className="relative z-10 mb-6 flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{capitalize(active)} Nexus</h1>
        <p className="text-sm text-muted-foreground">{data.tagline}</p>
      </header>

      <div className="relative z-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Visual Elements */}
        <Section title="Core Visual Elements">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.visualElements.map((el, i) => (
              <Card key={i} className="bg-background/40 backdrop-blur border-border/40">
                <CardContent className="flex items-center gap-3 p-3">
                  <div
                    className={cn(
                      "h-10 w-10 shrink-0 rounded-md bg-center bg-no-repeat bg-cover border border-border/40",
                    )}
                    style={el.iconUrl ? { backgroundImage: `url(${el.iconUrl})` } : undefined}
                    aria-label={el.name}
                  />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-foreground">{el.name}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{el.description}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Color Palette */}
        <Section title="Color Palette">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.colorPalette.map((c, i) => (
              <ColorSwatch key={i} item={c} />
            ))}
          </div>
        </Section>

        {/* Typography */}
        <Section title="Typography">
          <div className="grid grid-cols-1 gap-3">
            {data.typography.map((t, i) => (
              <Card key={i} className="bg-background/40 backdrop-blur border-border/40">
                <CardContent className="p-4">
                  <div className="text-lg font-semibold text-foreground">{t.example}</div>
                  <div className="text-xs text-muted-foreground">{t.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* Iconography */}
        <Section title="Iconography">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
            {data.iconography.map((ico, i) => (
              <div key={i} className="flex flex-col items-center gap-2 rounded-md border border-border/40 bg-background/40 p-3 backdrop-blur">
                <div
                  className="h-12 w-12 rounded bg-center bg-no-repeat bg-cover border border-border/40"
                  style={ico.iconUrl ? { backgroundImage: `url(${ico.iconUrl})` } : undefined}
                  aria-label={ico.name}
                />
                <span className="truncate text-xs text-muted-foreground">{ico.name}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Visual Treatments */}
        <Section title="Visual Treatments">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.visualTreatments.map((vt, i) => (
              <div key={i} className="rounded-md border border-border/40 bg-background/40 p-3 backdrop-blur">
                <div
                  className="mb-2 h-24 w-full rounded bg-center bg-no-repeat bg-cover border border-border/40"
                  style={vt.imageUrl ? { backgroundImage: `url(${vt.imageUrl})` } : undefined}
                  aria-label={vt.name}
                />
                <div className="text-sm font-medium text-foreground">{vt.name}</div>
                <div className="text-xs text-muted-foreground">{vt.description}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Applied Examples (full width across columns) */}
        <div className="md:col-span-2 xl:col-span-3">
          <Section title="Applied Design Examples">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.examples.map((ex, i) => (
                <Card key={i} className="overflow-hidden border-border/40">
                  <CardHeader className="border-b border-border/40 bg-background/50 py-3">
                    <CardTitle className="text-base">{ex.type}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div
                      className="h-40 w-full bg-center bg-no-repeat bg-cover"
                      style={{ backgroundImage: `url(${ex.imageUrl})` }}
                      aria-label={ex.type}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

function ColorSwatch({ item }: { item: ColorPaletteItem }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border/40 bg-background/40 p-3 backdrop-blur">
      <div className="h-10 w-10 rounded-md border border-border/40" style={{ backgroundColor: item.hex }} />
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-foreground">{item.name}</div>
        <div className="text-xs text-muted-foreground">{item.hex}</div>
      </div>
    </div>
  );
}

function capitalize(s: string) {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
