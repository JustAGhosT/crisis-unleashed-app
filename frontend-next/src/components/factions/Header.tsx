"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type HeaderProps = {
  title: string;
  className?: string;
};

export function Header({ title, className }: HeaderProps) {
  return (
    <header className={cn("mb-4 flex items-center justify-between", className)}>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
    </header>
  );
}

export default Header;
