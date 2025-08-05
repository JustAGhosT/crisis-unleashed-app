import axios from 'axios';

// API client configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use((config) => {
  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Enhanced response interceptor with better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error details
    const status = error.response?.status;
    const responseData = error.response?.data;
    const errorMessage = responseData?.message || error.message;

    // Log error with more context
    console.error(`API Error (${status}):`, errorMessage, {
      url: error.config?.url,
      method: error.config?.method,
      data: responseData
    });

    // Create standardized ApiException
    const apiError = new ApiException(
      errorMessage,
      status || 500,
      responseData?.code
    );

    // Handle specific status codes
    if (status === 401) {
      // Could dispatch auth logout action or redirect to login
      console.warn('Authentication required. User may need to log in again.');
    }

    return Promise.reject(apiError);
  }
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
    this.name = 'ApiException';
  }
}

// Generic API request wrapper with strong typing
export async function apiRequest<T>(
  requestFn: () => Promise<{ data: T }>
): Promise<T> {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    // Rethrow if already an ApiException
    if (error instanceof ApiException) {
      throw error;
    }

    // Otherwise create and throw a new ApiException
    throw new ApiException(
      error instanceof Error ? error.message : 'Unknown error occurred',
      error instanceof Error && 'status' in error ? (error as any).status : 500
    );
  }
}
