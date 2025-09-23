import { z } from 'zod';

/**
 * Comprehensive API validation utilities with Zod schemas
 */

// Base validation schemas
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  timestamp: z.string().optional(),
});

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
    requestId: z.string().optional(),
  }),
  success: z.literal(false),
  timestamp: z.string(),
});

// User and Auth schemas
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['user', 'admin', 'moderator']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  isActive: z.boolean(),
});

export const AuthTokenSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresIn: z.number().positive(),
  tokenType: z.literal('Bearer'),
});

// Card and Game schemas
export const CardSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  cost: z.number().int().min(0).max(20),
  power: z.number().int().min(0).max(20).optional(),
  health: z.number().int().min(0).max(20).optional(),
  type: z.enum(['hero', 'unit', 'action', 'structure']),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary']),
  faction: z.string().min(1),
  abilities: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),
  isOwned: z.boolean().default(false),
});

export const DeckSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50),
  description: z.string().max(200).optional(),
  cards: z.array(z.object({
    cardId: z.string().uuid(),
    quantity: z.number().int().min(1).max(3),
  })),
  factions: z.array(z.string()).min(1).max(2),
  isPublic: z.boolean().default(false),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  owner: UserSchema.pick({ id: true, username: true }),
});

// API Response wrappers
export const createSuccessResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    success: z.literal(true),
    message: z.string().optional(),
    timestamp: z.string().datetime(),
  });

export const createPaginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationSchema,
    success: z.literal(true),
    timestamp: z.string().datetime(),
  });

// Request validation schemas
export const CreateDeckRequestSchema = z.object({
  name: z.string().min(1).max(50).trim(),
  description: z.string().max(200).trim().optional(),
  cards: z.array(z.object({
    cardId: z.string().uuid(),
    quantity: z.number().int().min(1).max(3),
  })).min(30).max(50),
  factions: z.array(z.string()).min(1).max(2),
  isPublic: z.boolean().default(false),
});

export const UpdateDeckRequestSchema = CreateDeckRequestSchema.partial().extend({
  id: z.string().uuid(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
  rememberMe: z.boolean().default(false),
});

export const RegisterRequestSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8).max(128),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export class ApiValidationError extends Error {
  public readonly errors: ValidationError[];
  public readonly statusCode: number;

  constructor(errors: ValidationError[], message = 'Validation failed') {
    super(message);
    this.name = 'ApiValidationError';
    this.errors = errors;
    this.statusCode = 400;
  }
}

/**
 * Validates request data against a schema
 */
export function validateRequest<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors: ValidationError[] = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      }));
      throw new ApiValidationError(validationErrors);
    }
    throw error;
  }
}

/**
 * Validates response data against a schema with error recovery
 */
export function validateResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  fallback?: T
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error('Response validation failed:', error);

    // Log the validation error for debugging
    if (error instanceof z.ZodError) {
      console.error('Validation errors:', error.errors);
      console.error('Received data:', JSON.stringify(data, null, 2));
    }

    // Return fallback if provided, otherwise rethrow
    if (fallback !== undefined) {
      console.warn('Using fallback data due to validation failure');
      return fallback;
    }

    throw new Error(`Response validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Safe parsing that returns a result object instead of throwing
 */
export function safeParseResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string; issues?: z.ZodIssue[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return {
      success: false,
      error: 'Validation failed',
      issues: result.error.issues,
    };
  }
}

/**
 * Validates and transforms form data for API requests
 */
export function prepareRequestData<T>(
  schema: z.ZodSchema<T>,
  formData: unknown
): T {
  // Pre-process common transformations
  let processedData = formData;

  if (typeof formData === 'object' && formData !== null) {
    processedData = Object.entries(formData).reduce((acc, [key, value]) => {
      // Trim strings
      if (typeof value === 'string') {
        acc[key] = value.trim();
      }
      // Convert empty strings to undefined for optional fields
      else if (value === '') {
        acc[key] = undefined;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, unknown>);
  }

  return validateRequest(schema, processedData);
}

/**
 * Higher-order function to create type-safe API functions
 */
export function createValidatedApiFunction<TRequest, TResponse>(
  requestSchema: z.ZodSchema<TRequest>,
  responseSchema: z.ZodSchema<TResponse>
) {
  return (apiFn: (data: TRequest) => Promise<unknown>) =>
    async (data: unknown): Promise<TResponse> => {
      // Validate request
      const validatedRequest = validateRequest(requestSchema, data);

      // Call API function
      const response = await apiFn(validatedRequest);

      // Validate response
      return validateResponse(responseSchema, response);
    };
}

/**
 * Utility to create form field validators
 */
export function createFieldValidator<T>(schema: z.ZodSchema<T>) {
  return (value: unknown): { isValid: boolean; error?: string } => {
    const result = schema.safeParse(value);
    if (result.success) {
      return { isValid: true };
    } else {
      return {
        isValid: false,
        error: result.error.errors[0]?.message || 'Invalid value',
      };
    }
  };
}

// Pre-created validators for common fields
export const emailValidator = createFieldValidator(z.string().email());
export const passwordValidator = createFieldValidator(z.string().min(8));
export const usernameValidator = createFieldValidator(z.string().min(3).max(30));

/**
 * Sanitizes data before sending to API to prevent XSS
 */
export function sanitizeForApi(data: unknown): unknown {
  if (typeof data === 'string') {
    // Basic HTML tag stripping and XSS prevention
    return data
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<[^>]*>?/gm, '')
      .trim();
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeForApi);
  }

  if (typeof data === 'object' && data !== null) {
    const sanitized: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      sanitized[key] = sanitizeForApi(value);
    });
    return sanitized;
  }

  return data;
}