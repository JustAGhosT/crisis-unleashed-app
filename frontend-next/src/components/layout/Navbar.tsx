"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import GameStatus from "@/components/game/GameStatus";

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? "text-blue-600 border-b-2 border-blue-600" : "";
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-gray-800">
              Crisis Unleashed
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8">
            <Link href="/" className={`flex items-center font-medium ${isActive("/")}`}>
              Home
            </Link>
            <Link href="/dashboard" className={`flex items-center font-medium ${isActive("/dashboard")}`}>
              Dashboard
            </Link>
            <Link href="/factions" className={`flex items-center font-medium ${isActive("/factions")}`}>
              Factions
            </Link>
            <Link href="/cards" className={`flex items-center font-medium ${isActive("/cards")}`}>
              Cards
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <GameStatus compact={true} />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}