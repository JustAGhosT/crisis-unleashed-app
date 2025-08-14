import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import Link from "next/link";
import FactionsThemeShell from "../../factions/FactionsThemeShell";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your Crisis Unleashed account",
};

export default function LoginPage() {
  return (
    <FactionsThemeShell>
      <div className="min-h-[calc(100vh-16rem)] flex flex-col justify-center py-12">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/">
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Crisis Unleashed
            </h2>
          </Link>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <div className="mt-8">
          <Suspense fallback={<div>Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </FactionsThemeShell>
  );
}
