import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Crisis Unleashed",
    template: "%s | Crisis Unleashed",
  },
  description: "Strategic card game with unique factions battling in a dystopian future",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}