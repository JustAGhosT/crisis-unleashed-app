"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type DescriptionSectionProps = {
  title: string;
  children: React.ReactNode;
  choiceText?: string;
  className?: string;
};

export function DescriptionSection({ title, children, choiceText, className }: DescriptionSectionProps) {
  return (
    <section className={cn("rounded-lg border border-border/40 bg-background/40 p-4 backdrop-blur", className)}>
      <h2 className="mb-2 text-base font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="prose prose-invert max-w-none text-sm text-muted-foreground">
        {children}
      </div>
      {choiceText && (
        <p className="mt-3 text-xs text-muted-foreground/80">{choiceText}</p>
      )}
    </section>
  );
}

export default DescriptionSection;
