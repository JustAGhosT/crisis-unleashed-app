import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Crisis Unleashed",
  description: "Login to your Crisis Unleashed account",
};

export default function LoginPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Login to Crisis Unleashed
      </h1>
      <Suspense fallback={<div>Loading…</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
