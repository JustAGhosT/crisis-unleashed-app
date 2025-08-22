"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useFactionTheme } from "@/lib/theme/theme-context";
import { FACTION_TOKENS, DEFAULT_TOKENS, type FactionKey } from "@/lib/theme/faction-theme";
import { getMoodBoardData } from "@/data/factions/moodboard";
import type { ColorPaletteItem } from "@/types/moodboard";
import styles from "./MoodBoard.module.css";

/**
 * Note on inline styles: We follow Option A (CSS variables with helper classes) and avoid inline styles.
 * The only exception here is setting CSS custom properties (e.g., `--mb-url`, `--swatch-color`) needed for
 * dynamic backgrounds/colors. The CSS is defined in `MoodBoard.module.css`; TSX sets only the variable value.
 */

export type MoodBoardProps = {
  factionId?: FactionKey; // optional; defaults to active theme
  expanded?: boolean;
  className?: string;
};

export default function MoodBoard({ factionId, expanded = false, className }: MoodBoardProps) {
  const { factionKey } = useFactionTheme();
  const active = factionId ?? factionKey;
  const tokens = FACTION_TOKENS[active] ?? DEFAULT_TOKENS;
  const data = getMoodBoardData(active);

  // Track image load errors to provide graceful fallbacks for background images
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());
  type CSSVars = React.CSSProperties & { [key: string]: string | number | undefined };
  const getImageAttrs = (url: string | undefined): { cls: string; style?: CSSVars } => {
    if (!url || imageErrors.has(url)) {
      return { cls: "bg-muted" };
    }
    // Use CSS module helper classes; set only the CSS variable inline.
    return {
      cls: cn(styles.bgImage, styles.bgImageVar),
      style: { ["--mb-url"]: `url(${url})` } as CSSVars,
    };
  };

  // Preload images to detect broken links since onError won't fire for CSS backgrounds
  React.useEffect(() => {
    const urls: string[] = data
      ? [
          ...data.visualElements.map(v => v.iconUrl).filter(Boolean) as string[],
          ...data.iconography.map(i => i.iconUrl).filter(Boolean) as string[],
          ...data.visualTreatments.map(vt => vt.imageUrl).filter(Boolean) as string[],
          ...data.examples.map(ex => ex.imageUrl).filter(Boolean) as string[],
        ]
      : [];

    const imgs: HTMLImageElement[] = [];
    let cancelled = false;

    urls.forEach((url) => {
      const img = new Image();
      imgs.push(img);
      img.onload = () => { /* ok */ };
      img.onerror = () => {
        if (cancelled) return;
        setImageErrors(prev => {
          if (prev.has(url)) return prev;
          const next = new Set(prev);
          next.add(url);
          return next;
        });
      };
      img.src = url;
    });

    return () => {
      cancelled = true;
      for (const img of imgs) {
        // Detach listeners and abort pending loads to free resources
        img.onload = null;
        img.onerror = null;
        try {
          img.src = "";
        } catch {
          // ignore
        }
      }
    };
  }, [data]);

  if (!data) {
    return (
      <div className={cn("p-6 text-center text-muted-foreground", className)}>
        No moodboard data available for {active}
      </div>
    );
  }

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
                  {(() => {
                    const attrs = getImageAttrs(el.iconUrl);
                    return (
                      <div
                        className={cn(
                          "h-10 w-10 shrink-0 rounded-md border border-border/40",
                          styles.bgImage,
                          attrs.cls,
                        )}
                        // eslint-disable-next-line react/forbid-dom-props
                        style={attrs.style}
                        aria-label={el.name}
                      />
                    );
                  })()}
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
                {(() => {
                  const attrs = getImageAttrs(ico.iconUrl);
                  return (
                    <div
                      className={cn(
                        "h-12 w-12 rounded bg-center bg-no-repeat bg-cover border border-border/40",
                        attrs.cls,
                      )}
                      // eslint-disable-next-line react/forbid-dom-props
                      style={attrs.style}
                      aria-label={ico.name}
                    />
                  );
                })()}
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
                {(() => {
                  const attrs = getImageAttrs(vt.imageUrl);
                  return (
                    <div
                      className={cn(
                        "mb-2 h-24 w-full rounded border border-border/40",
                        styles.bgImage,
                        attrs.cls,
                      )}
                      // eslint-disable-next-line react/forbid-dom-props
                      style={attrs.style}
                      aria-label={vt.name}
                    />
                  );
                })()}
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
                    {(() => {
                      const attrs = getImageAttrs(ex.imageUrl);
                      return (
                        <div
                          className={cn(
                            "h-40 w-full",
                            styles.bgImage,
                            attrs.cls,
                          )}
                          // eslint-disable-next-line react/forbid-dom-props
                          style={attrs.style}
                          aria-label={ex.type}
                        />
                      );
                    })()}
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
      <div
        className={cn("h-10 w-10 rounded-md border border-border/40", styles.swatchColor)}
        // eslint-disable-next-line react/forbid-dom-props
        style={{ ["--swatch-color"]: item.hex } as React.CSSProperties}
      />
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
