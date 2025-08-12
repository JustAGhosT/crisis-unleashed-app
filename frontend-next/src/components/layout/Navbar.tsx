"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import GameStatus from "@/components/game/GameStatus";
import { useSession, signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path ? "text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400" : "";
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-800 dark:text-white transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-gray-800 dark:text-white">
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
            {session && (
              <Link href="/deck-builder" className={`flex items-center font-medium ${isActive("/deck-builder")}`}>
                Deck Builder
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <GameStatus compact={true} />
            {session ? (
              <div className="relative">
                <button 
                  className="flex items-center space-x-2"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                    {user?.image ? (
                      <Image 
                        src={user.image} 
                        alt={user?.name ?? user?.email ?? "User"} 
                        width={32} 
                        height={32}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white text-sm font-medium">
                        {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="font-medium text-sm hidden lg:block">{user?.name ?? user?.email ?? "User"}</span>
                </button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-10">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link 
                      href="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => setIsProfileMenuOpen(false)}
              >
                      Settings
              </Link>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Sign Out
                    </button>
        </div>
                )}
      </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  href="/login" 
                  className="text-blue-600 dark:text-blue-400 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}