/**
 * @deprecated Use @/components/ui/theme-toggle instead
 * This file is maintained for backward compatibility
 */

import { ThemeToggle as UnifiedThemeToggle } from "@/components/ui/theme-toggle";

export function ThemeToggle({ className = "" }: { className?: string }) {
  return (
    <UnifiedThemeToggle
      variant="buttons"
      className={className}
      requireFeatureFlag={true}
    />
  );
}
