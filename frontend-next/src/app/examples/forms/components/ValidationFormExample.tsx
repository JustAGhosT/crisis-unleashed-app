"use client";

import React, { useState } from "react";
import { z } from "zod";
import {
  TextInput,
  TextArea,
  SelectInput,
  CheckboxInput,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";

// Define validation schema using Zod
const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters" })
      .max(20, { message: "Username must be at most 20 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    role: z.string().min(1, { message: "Please select a role" }),
    bio: z
      .string()
      .max(200, { message: "Bio must be at most 200 characters" })
      .optional(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type for our form data
type FormData = z.infer<typeof formSchema>;

export default function ValidationFormExample() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    bio: "",
    agreeToTerms: false,
  });

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeToTerms: checked }));

    // Clear error for this field when user changes it
    if (errors.agreeToTerms) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.agreeToTerms;
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));

    // Clear error for this field when user changes it
    if (errors.role) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.role;
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      formSchema.parse(formData);
      setErrors({});
      setFormError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Show success message
      setIsSubmitted(true);
    }

    setIsSubmitting(false);
  };

  // Role options for select input
  const roleOptions = [
    { value: "user", label: "Regular User" },
    { value: "moderator", label: "Moderator" },
    { value: "admin", label: "Administrator" },
  ];

  return (
    <div>
      {isSubmitted ? (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-300">
            Registration Successful!
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-400">
            Your account has been created successfully. You can now log in with
            your credentials.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {formError && (
            <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <AlertTitle className="text-red-800 dark:text-red-300">
                Error
              </AlertTitle>
              <AlertDescription className="text-red-700 dark:text-red-400">
                {formError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="username"
                name="username"
                label="Username"
                placeholder="Choose a username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                required
              />

              <TextInput
                id="email"
                name="email"
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                id="password"
                name="password"
                label="Password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                description="Must be at least 8 characters with 1 uppercase letter and 1 number"
                required
              />

              <TextInput
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required
              />
            </div>

            <SelectInput
              id="role"
              label="Role"
              options={roleOptions}
              value={formData.role}
              onChange={handleSelectChange}
              placeholder="Select your role"
              error={errors.role}
              required
            />

            <TextArea
              id="bio"
              name="bio"
              label="Bio"
              placeholder="Tell us about yourself (optional)"
              value={formData.bio}
              onChange={handleChange}
              error={errors.bio}
              maxLength={200}
              showCharacterCount
              rows={4}
            />

            <CheckboxInput
              id="agreeToTerms"
              label="I agree to the terms and conditions"
              checked={formData.agreeToTerms}
              onChange={handleCheckboxChange}
              error={errors.agreeToTerms}
              required
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? "Submitting..." : "Register"}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
