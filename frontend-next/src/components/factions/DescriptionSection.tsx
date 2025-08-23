"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type DescriptionSectionProps = Omit<React.ComponentPropsWithoutRef<"section">, "children"> & {
  title: string | React.ReactNode;
  children: React.ReactNode;
  choiceText?: React.ReactNode;
  className?: string;
};

export function DescriptionSection({
  title,
  children,
  choiceText,
  className,
  id,
  ...rest
}: DescriptionSectionProps) {
  const headingId = id ? `${id}-title` : undefined;
  const choiceId = id && choiceText ? `${id}-choice` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-describedby={choiceId}
      className={cn("rounded-lg border border-border/40 bg-background/40 p-4 backdrop-blur", className)}
      {...rest}
    >
      <h2 id={headingId} className="mb-2 text-base font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <div className="prose dark:prose-invert max-w-none text-sm text-muted-foreground">
        {children}
      </div>
      {choiceText && (
        <p id={choiceId} className="mt-3 text-xs text-muted-foreground/80">
          {choiceText}
        </p>
      )}
    </section>
  );
}

export default DescriptionSection;
