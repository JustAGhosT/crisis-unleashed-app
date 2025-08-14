"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { PasswordForm } from "@/components/settings/PasswordForm";
import { GamePreferencesForm } from "@/components/settings/GamePreferencesForm";
import RequireAuth from "@/components/auth/RequireAuth";
export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const user = session?.user;

  const handleSuccess = () => {
    setUpdateError(null);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const handleError = (error: string) => {
    setUpdateError(error);
  };

  if (status === "loading") {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="max-w-4xl mx-auto py-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              Account Settings
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage your account preferences and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="profile"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="preferences">Game Preferences</TabsTrigger>
              </TabsList>

              {updateSuccess && (
                <Alert className="mb-6 bg-green-900/20 border-green-800 text-green-200">
                  <AlertDescription>
                    Settings updated successfully!
                  </AlertDescription>
                </Alert>
              )}

              {updateError && (
                <Alert
                  className="mb-6 bg-red-900/20 border-red-800 text-red-200"
                  variant="destructive"
                >
                  <AlertDescription>{updateError}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="profile">
                <ProfileForm
                  user={{
                    username: (user?.name ?? user?.email ?? "").toString(),
                    email: user?.email ?? "",
                  }}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </TabsContent>

              <TabsContent value="password">
                <PasswordForm onSuccess={handleSuccess} onError={handleError} />
              </TabsContent>

              <TabsContent value="preferences">
                <GamePreferencesForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </RequireAuth>
  );
}
