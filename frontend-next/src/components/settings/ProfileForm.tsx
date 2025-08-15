"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { getFactionOptions } from "@/data/factions";

// Profile update schema
const profileSchema = z.object({
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
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  user: {
    username: string;
    email: string;
    preferredFaction?:
      | ""
      | "solaris"
      | "umbral"
      | "aeonic"
      | "primordial"
      | "infernal"
      | "neuralis"
      | "synthetic";
  };
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function ProfileForm({ user, onSuccess, onError }: ProfileFormProps) {
  const factionOptions = getFactionOptions();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      preferredFaction: "",
    },
  });

  const onSubmit = async () => {
    try {
      // In a real app, this would be an API call to update the profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSuccess();
    } catch {
      onError("Failed to update profile. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium text-gray-200">
          Username
        </label>
        <Input
          id="username"
          {...register("username")}
          className={`bg-slate-700 border ${
            errors.username ? "border-red-500" : "border-slate-600"
          }`}
        />
        {errors.username && (
          <p className="text-red-400 text-sm">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-200">
          Email
        </label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className={`bg-slate-700 border ${
            errors.email ? "border-red-500" : "border-slate-600"
          }`}
        />
        {errors.email && (
          <p className="text-red-400 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="preferredFaction"
          className="text-sm font-medium text-gray-200"
        >
          Preferred Faction
        </label>
        <Select
          id="preferredFaction"
          {...register("preferredFaction")}
          className="bg-slate-700 border-slate-600 text-white"
        >
          <option value="">Select a faction</option>
          {factionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-4">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
