import { RegisterForm } from "@/components/auth/RegisterForm";
import Link from "next/link";
import FactionsThemeShell from "../../factions/FactionsThemeShell";

export const metadata = {
  title: "Create Account",
  description: "Create a new Crisis Unleashed account",
};

export default function RegisterPage() {
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
            Create a new account to get started
          </p>
        </div>

        <div className="mt-8">
          <RegisterForm />
        </div>
      </div>
    </FactionsThemeShell>
  );
}
