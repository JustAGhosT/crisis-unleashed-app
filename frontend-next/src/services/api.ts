import axios from "axios";

// API client configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to safely log API errors without exposing sensitive data
const safelyLogError = (error: unknown) => {
  let status: number | undefined;
  let url = "unknown";
  let method = "unknown";
  let errorMessage = "Unknown error";

  if (axios.isAxiosError(error)) {
    status = error.response?.status;
    url = error.config?.url ?? "unknown";
    method = error.config?.method ?? "unknown";
    const responseMessage = (
      error.response?.data as { message?: string } | undefined
    )?.message;
    errorMessage = responseMessage || error.message || "Unknown error";
  } else if (error && typeof error === "object") {
    const maybe = error as { message?: string };
    errorMessage = maybe.message || "Unknown error";
  }

  // Safe metadata that doesn't include potentially sensitive response data
  const safeErrorInfo = {
    url: url.replace(/\/[^/]+$/, "/*"), // Replace specific IDs in URL paths
    method,
    status,
    errorType: axios.isAxiosError(error)
      ? error.code || "API_ERROR"
      : "API_ERROR",
  };

  // In development, provide more details but still sanitize sensitive data
  if (process.env.NODE_ENV === "development") {
    // Create a sanitized version of the response data if it exists
    const sanitizedData =
      axios.isAxiosError(error) && error.response?.data
        ? sanitizeResponseData(error.response.data)
        : undefined;

    console.error(`API Error (${status}):`, errorMessage, {
      ...safeErrorInfo,
      sanitizedData,
    });
  } else {
    // In production, log minimal information
    console.error(`API Error (${status}): ${errorMessage}`, safeErrorInfo);
  }
};

// Helper to sanitize potentially sensitive data
const sanitizeResponseData = (data: unknown) => {
  if (!data || typeof data !== "object") return undefined;

  // Create a shallow copy to avoid modifying the original
  const sanitized: Record<string, unknown> = {
    ...(data as Record<string, unknown>),
  };

  // List of fields that might contain sensitive information
  const sensitiveFields = [
    "password",
    "token",
    "secret",
    "key",
    "auth",
    "credential",
    "ssn",
    "social",
    "credit",
    "card",
    "cvv",
    "email",
    "phone",
    "address",
    "birth",
    "license",
    "account",
    "username",
    "user",
    "apiKey",
    "accessToken",
    "refreshToken",
  ];

  // Redact sensitive fields
  Object.keys(sanitized).forEach((key) => {
    const lowerKey = key.toLowerCase();
    if (sensitiveFields.some((field) => lowerKey.includes(field))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      // Recursively sanitize nested objects, but limit depth
      sanitized[key] = "[COMPLEX OBJECT]";
    }
  });

  return sanitized;
};

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  // Add auth token if available
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced response interceptor with better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Safely log the error without exposing sensitive data
    safelyLogError(error);

    // Extract error details
    const status = error.response?.status;
    const responseData = error.response?.data;
    const errorMessage = responseData?.message || error.message;

    // Create standardized ApiException
    const apiError = new ApiException(
      errorMessage,
      status || 500,
      responseData?.code,
    );

    // Handle specific status codes
    if (status === 401) {
      // Could dispatch auth logout action or redirect to login
      console.warn("Authentication required. User may need to log in again.");
    }

    return Promise.reject(apiError);
  },
);

// API error handling types
export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export class ApiException extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "ApiException";
  }
}

// Generic API request wrapper with strong typing
export async function apiRequest<T>(
  requestFn: () => Promise<{ data: T }>,
): Promise<T> {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error: unknown) {
    // Rethrow if already an ApiException
    if (error instanceof ApiException) {
      throw error;
    }

    // Handle Axios errors properly
    if (axios.isAxiosError(error)) {
      // Use response status if available, 0 for network errors, or undefined
      const status =
        error.response?.status ??
        (error.code === "ECONNABORTED" ? 0 : undefined);

      throw new ApiException(
        error.message,
        // Use 0 for network errors (like timeouts), keep original status if available
        status ?? 0,
      );
    }

    // For other errors
    throw new ApiException(
      error instanceof Error ? error.message : "Unknown error occurred",
      0, // Use 0 for unknown/network errors instead of 500
    );
  }
}
