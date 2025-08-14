import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { FeatureFlagProvider } from "@/lib/feature-flags/feature-flag-provider";
import { QueryProvider } from "@/lib/query-provider";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FeatureFlagIndicator from "@/components/feature-flags/FeatureFlagIndicator";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { RUMInit } from "@/components/observability/RUMInit";
import { ToastProvider } from "@/hooks/useToast";
import { SessionProvider } from "next-auth/react";
import { cookies } from "next/headers";
import FactionThemeRoot from "./FactionThemeRoot";
import { FACTION_KEYS, type FactionKey } from "@/lib/theme/faction-theme";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Crisis Unleashed",
    template: "%s | Crisis Unleashed",
  },
  description:
    "Strategic card game with unique factions battling in a dystopian future",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // SSR cookie sync for initial theme selection
  const c = cookies();
  const raw = (c.get("theme:active")?.value || "").toLowerCase();
  const initialFaction: FactionKey = (FACTION_KEYS as readonly string[]).includes(raw)
    ? (raw as FactionKey)
    : "default";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ToastProvider>
            <QueryProvider>
              <SessionProvider>
                <AuthProvider>
                  <FeatureFlagProvider>
                    <Providers>
                      <FactionThemeRoot initial={initialFaction}>
                        <div className="relative flex min-h-screen flex-col">
                          <Navbar />
                          <main className="flex-1 container mx-auto px-4 py-6">
                            {children}
                          </main>
                          <Footer />
                          <FeatureFlagIndicator />
                          <RUMInit />
                        </div>
                      </FactionThemeRoot>
                    </Providers>
                  </FeatureFlagProvider>
                </AuthProvider>
              </SessionProvider>
            </QueryProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
