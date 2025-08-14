"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
// Assuming this function exists in your codebase; if not, we'll need to create it
import { getFactionOptions } from "@/data/factions";

// Zod schema for player registration validation
const playerRegistrationSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z.string().email("Please enter a valid email address"),
  preferredFaction: z
    .enum([
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
    .refine((val) => val === true, "You must accept the terms and conditions"),
});

type PlayerRegistrationData = z.infer<typeof playerRegistrationSchema>;

interface PlayerRegistrationFormProps {
  onSubmit: (data: PlayerRegistrationData) => void;
  isLoading?: boolean;
}

/**
 * PlayerRegistrationForm - Demonstrates React Hook Form + Zod integration
 *
 * Following SOLID principles:
 * - Single Responsibility: Handles player registration
 * - Open/Closed: Extensible through props and composition
 * - Interface Segregation: Clean props interface
 * - Dependency Inversion: Depends on form validation abstraction
 */
export const PlayerRegistrationForm: React.FC<PlayerRegistrationFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<PlayerRegistrationData>({
    resolver: zodResolver(playerRegistrationSchema),
    mode: "onChange",
  });

  const selectedFaction = watch("preferredFaction");
  const factionOptions = getFactionOptions();
  // Intentionally ignore state values until modals are rendered
  const [, setShowTermsModal] = React.useState(false);
  const [, setShowPrivacyModal] = React.useState(false);

  const handleFormSubmit = (data: PlayerRegistrationData) => {
    onSubmit(data);
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
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Username Field */}
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-200"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              {...register("username")}
              className={cn(
                "w-full px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                errors.username ? "border-red-500" : "border-slate-600",
              )}
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
            <input
              id="email"
              type="email"
              {...register("email")}
              className={cn(
                "w-full px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-gray-400",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                errors.email ? "border-red-500" : "border-slate-600",
              )}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
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
              {...register("preferredFaction")}
              className={cn(
                "w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
              )}
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
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Terms and Conditions
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Privacy Policy
                </button>
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
            className="w-full"
            disabled={!isValid || isLoading}
            variant="faction"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

PlayerRegistrationForm.displayName = "PlayerRegistrationForm";
