"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type TimelineSectionProps = {
  title: string;
  description: string;
  buttonText: string;
  onTimelineClick: () => void;
  className?: string;
};

export function TimelineSection({ title, description, buttonText, onTimelineClick, className }: TimelineSectionProps) {
  return (
    <section className={cn("rounded-lg border border-border/40 bg-background/40 p-4 backdrop-blur", className)}>
      <h2 className="mb-1 text-base font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mb-3 text-sm text-muted-foreground">{description}</p>
      <button
        className="inline-flex items-center gap-2 rounded-md border border-border/40 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm transition hover:bg-background/80"
        onClick={onTimelineClick}
        type="button"
      >
        {buttonText}
      </button>
    </section>
  );
}

export default TimelineSection;
