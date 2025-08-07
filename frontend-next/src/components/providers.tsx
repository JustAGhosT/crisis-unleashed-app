import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/hooks/useToast";
import { FeatureFlagProvider } from "@/lib/feature-flags/feature-flag-provider";
import { QueryProvider } from "@/lib/query-provider";
import React from 'react';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <FeatureFlagProvider>
        <QueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </QueryProvider>
      </FeatureFlagProvider>
    </ThemeProvider>
  );
}