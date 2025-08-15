"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Password change schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

interface PasswordFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function PasswordForm({ onSuccess, onError }: PasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async () => {
    try {
      // In a real app, this would be an API call to change the password
      await new Promise((resolve) => setTimeout(resolve, 1000));

      reset();
      onSuccess();
    } catch {
      onError("Failed to change password. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="currentPassword"
          className="text-sm font-medium text-gray-200"
        >
          Current Password
        </label>
        <Input
          id="currentPassword"
          type="password"
          {...register("currentPassword")}
          className={`bg-slate-700 border ${
            errors.currentPassword ? "border-red-500" : "border-slate-600"
          }`}
        />
        {errors.currentPassword && (
          <p className="text-red-400 text-sm">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="newPassword"
          className="text-sm font-medium text-gray-200"
        >
          New Password
        </label>
        <Input
          id="newPassword"
          type="password"
          {...register("newPassword")}
          className={`bg-slate-700 border ${
            errors.newPassword ? "border-red-500" : "border-slate-600"
          }`}
        />
        {errors.newPassword && (
          <p className="text-red-400 text-sm">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-gray-200"
        >
          Confirm New Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          className={`bg-slate-700 border ${
            errors.confirmPassword ? "border-red-500" : "border-slate-600"
          }`}
        />
        {errors.confirmPassword && (
          <p className="text-red-400 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="mt-4">
        {isSubmitting ? "Changing Password..." : "Change Password"}
      </Button>
    </form>
  );
}
