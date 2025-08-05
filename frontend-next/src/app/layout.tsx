import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crisis Unleashed",
  description: "A strategic digital collectible card game set in a multiverse where seven unique factions battle for supremacy",
  keywords: ["card game", "strategy", "digital collectibles", "NFT", "blockchain", "gaming"],
  authors: [{ name: "Crisis Unleashed Team" }],
  openGraph: {
    title: "Crisis Unleashed",
    description: "Strategic multiverse card game with faction-based gameplay",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}