"use client";

import { useAuth } from "@/lib/auth/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // If still loading, show skeleton
  if (isLoading) {
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

  // If no user is logged in, redirect to login
  if (!user) {
    router.push("/login");
    return null;
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    router.push("/");
  };

  return (
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
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.username}
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-xl font-bold text-white">{user.username}</h3>
                <p className="text-gray-400">{user.email}</p>
                <p className="text-gray-400 capitalize">Role: {user.role}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-white">Game Statistics</h4>
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
  );
}