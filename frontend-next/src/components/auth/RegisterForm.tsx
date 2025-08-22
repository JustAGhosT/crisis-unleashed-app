"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { getFactionOptions } from "@/data/factions";

// Zod schema for registration validation
const registerSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must be less than 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    preferredFaction: z
      .enum([
        "",
        "solaris",
        "umbral",
        "aeonic",
        "primordial",
        "infernal",
        "neuralis",
        "synthetic",
      ] as const)
      .optional(),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const factionOptions = getFactionOptions();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const selectedFaction = watch("preferredFaction");
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json?.error ?? "Registration failed");
        return;
      }
      // Auto sign-in after successful registration
      const login = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (login?.error) {
        // Registration succeeded but login failed; send to login page
        router.push("/login" as import("next").Route);
        return;
      }
      router.push("/dashboard" as import("next").Route);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Join Crisis Unleashed</CardTitle>
        <CardDescription className="text-gray-300">
          Create your account and choose your faction
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert
              variant="destructive"
              className="bg-red-900/50 border-red-800 text-red-200"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-200"
            >
              Username
            </label>
            <Input
              id="username"
              type="text"
              {...register("username")}
              className={`bg-slate-700 border ${
                errors.username ? "border-red-500" : "border-slate-600"
              }`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <p className="text-red-400 text-sm">{errors.username.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-200"
            >
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              className={`bg-slate-700 border ${
                errors.email ? "border-red-500" : "border-slate-600"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              className={`bg-slate-700 border ${
                errors.password ? "border-red-500" : "border-slate-600"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-200"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={`bg-slate-700 border ${
                errors.confirmPassword ? "border-red-500" : "border-slate-600"
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Faction Selection */}
          <div className="space-y-2">
            <label
              htmlFor="preferredFaction"
              className="text-sm font-medium text-gray-200"
            >
              Preferred Faction (Optional)
            </label>
            <select
              id="preferredFaction"
              title="Preferred Faction"
              {...register("preferredFaction")}
              className="w-full rounded-md border px-3 py-2 bg-slate-700 border-slate-600 text-white"
            >
              <option value="">Select a faction</option>
              {factionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {selectedFaction && (
              <p className="text-sm text-gray-400">
                You can change your faction later in game settings.
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="space-y-2">
            <label className="flex items-start space-x-2">
              <input
                type="checkbox"
                {...register("acceptTerms")}
                className="mt-1 h-4 w-4 text-purple-600 rounded border-slate-600 bg-slate-700 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-300">
                I accept the{" "}
                <Link
                  href={"/terms" as import("next").Route}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href={"/privacy" as import("next").Route}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && (
              <p className="text-red-400 text-sm">
                {errors.acceptTerms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>

          <div className="text-center text-gray-300 text-sm">
            Already have an account?{" "}
            <Link
              href={"/login" as import("next").Route}
              className="text-purple-400 hover:text-purple-300"
            >
              Login
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
