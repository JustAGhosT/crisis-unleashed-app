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
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
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
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
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

  const handleSocialRegister = async (provider: string) => {
    setSocialLoading(provider);
    try {
      const result = await signIn(provider, { 
        callbackUrl: "/dashboard",
        redirect: false // This ensures we get a result object instead of a redirect
      });
      
      // Check if the result indicates an error
      if (result && 'error' in result && result.error) {
        setError(`${provider} registration failed: ${result.error}`);
        setSocialLoading(null);
      } else if (result && 'ok' in result && result.ok) {
        // Success case - redirect manually
        router.push("/dashboard");
      } else if (result && 'url' in result && result.url) {
        // Redirect to the provided URL
        window.location.href = result.url;
      }
      // If none of the above, the function will handle redirect automatically
    } catch (error) {
      console.error(`${provider} registration error:`, error);
      setError(`${provider} registration failed. Please try again.`);
      setSocialLoading(null);
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
        {/* Social Login Buttons */}
        <div className="space-y-3 mb-4">
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-600 bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
            onClick={() => handleSocialRegister("google")}
            disabled={!!socialLoading}
          >
            {socialLoading === "google" ? (
              "Connecting..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-600 bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
            onClick={() => handleSocialRegister("discord")}
            disabled={!!socialLoading}
          >
            {socialLoading === "discord" ? (
              "Connecting..."
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                >
                  <path
                    d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"
                    fill="#5865F2"
                  />
                </svg>
                Continue with Discord
              </>
            )}
          </Button>
        </div>

        <div className="my-4 flex items-center">
          <Separator className="flex-grow bg-slate-600" />
          <span className="mx-2 text-sm text-slate-400">OR</span>
          <Separator className="flex-grow bg-slate-600" />
        </div>

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
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t border-slate-700 pt-4">
        <div className="text-center text-gray-300 text-sm">
          Already have an account?{" "}
          <Link
            href={"/login" as import("next").Route}
            className="text-purple-400 hover:text-purple-300"
          >
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}