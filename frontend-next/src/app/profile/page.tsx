"use client";

import { useSession, signOut } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import RequireAuth from "@/components/auth/RequireAuth";
import FactionsThemeShell from "../factions/FactionsThemeShell";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If still loading, show skeleton
  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <Skeleton className="h-8 w-48 bg-slate-700" />
            <Skeleton className="h-4 w-64 mt-2 bg-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="h-32 w-32 rounded-full bg-slate-700" />
              <div className="space-y-4 flex-1">
                <Skeleton className="h-6 w-32 bg-slate-700" />
                <Skeleton className="h-4 w-full bg-slate-700" />
                <Skeleton className="h-4 w-3/4 bg-slate-700" />
                <Skeleton className="h-10 w-32 mt-4 bg-slate-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const user = session?.user;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <RequireAuth>
      <FactionsThemeShell>
        <div className="max-w-4xl mx-auto py-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Your Profile</CardTitle>
              <CardDescription className="text-gray-300">
                Manage your account and view your game statistics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative h-32 w-32">
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? user.email ?? "User"}
                      width={128}
                      height={128}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                      {(user?.name ?? user?.email ?? "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {user?.name ?? user?.email}
                    </h3>
                    <p className="text-gray-400">{user?.email}</p>
                    {"role" in (user ?? {}) && (
                      <p className="text-gray-400 capitalize">
                        Role: {(user as { role?: string }).role ?? "user"}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-lg font-semibold text-white">
                      Game Statistics
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Games Played</p>
                        <p className="text-xl font-bold text-white">0</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Wins</p>
                        <p className="text-xl font-bold text-white">0</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Win Rate</p>
                        <p className="text-xl font-bold text-white">0%</p>
                      </div>
                      <div className="bg-slate-700/50 p-3 rounded-lg">
                        <p className="text-sm text-gray-400">Cards Owned</p>
                        <p className="text-xl font-bold text-white">0</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/settings")}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </FactionsThemeShell>
    </RequireAuth>
  );
}
