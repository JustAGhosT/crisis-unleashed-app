/**
 * Toast utilities for generating IDs and creating toast objects
 */

export interface ToastProps {
  id: string;
  title?: string;
  description: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export type ToastOptions = Omit<ToastProps, "id">;

/**
 * Generate a unique ID for a toast notification
 * Uses a combination of timestamp and random string for uniqueness
 */
export function generateToastId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `toast_${timestamp}_${randomPart}`;
}

/**
 * Create a complete toast object from options
 */
export function createToast(options: ToastOptions): ToastProps {
  return {
    id: generateToastId(),
    duration: 5000, // Default 5 seconds
    variant: "default", // Default variant
    ...options, // Override defaults with provided options
  };
}

/**
 * Validate toast options to ensure required fields are present
 */
export function validateToastOptions(options: ToastOptions): boolean {
  if (!options.description || typeof options.description !== "string") {
    console.warn("Toast description is required and must be a string");
    return false;
  }

  if (options.duration !== undefined && options.duration < 0) {
    console.warn("Toast duration must be non-negative");
    return false;
  }

  const validVariants = ["default", "destructive", "success"];
  if (options.variant && !validVariants.includes(options.variant)) {
    console.warn(`Invalid toast variant: ${options.variant}. Must be one of: ${validVariants.join(", ")}`);
    return false;
  }

  return true;
}

/**
 * Helper to create common toast types
 */
export const toastHelpers = {
  success: (description: string, title?: string, duration?: number): ToastOptions => ({
    description,
    title,
    variant: "success",
    duration,
  }),

  error: (description: string, title?: string, duration?: number): ToastOptions => ({
    description,
    title,
    variant: "destructive",
    duration,
  }),

  info: (description: string, title?: string, duration?: number): ToastOptions => ({
    description,
    title,
    variant: "default",
    duration,
  }),
};