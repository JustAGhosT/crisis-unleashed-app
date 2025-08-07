import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

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
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}