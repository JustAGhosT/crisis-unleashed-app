/**
 * Comprehensive TypeScript types for API responses with runtime validation
 */

import { z } from "zod";

// Base response schema
export const BaseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// User schema
export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  avatar: z.string().url().optional(),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
});

// Authentication response schema
export const AuthResponseSchema = BaseResponseSchema.extend({
  user: UserSchema.optional(),
  token: z.string().optional(),
});

// Card schema
export const CardSchema = z.object({
  id: z.string(),
  name: z.string(),
  faction: z.enum([
    "solaris_nexus",
    "umbral_eclipse",
    "aeonic_dominion",
    "primordial_genesis",
    "infernal_core",
    "neuralis_conclave",
    "synthetic_directive"
  ]),
  type: z.enum(["hero", "unit", "action", "structure"]),
  cost: z.number().min(0),
  rarity: z.enum(["common", "uncommon", "rare", "epic", "legendary"]),
  description: z.string(),
  abilities: z.array(z.string()).default([]),
  stats: z.object({
    attack: z.number().min(0).optional(),
    health: z.number().min(1).optional(),
    defense: z.number().min(0).optional(),
  }).optional(),
});

// Deck schema
export const DeckSchema = z.object({
  id: z.string(),
  name: z.string(),
  faction_primary: CardSchema.shape.faction,
  faction_secondary: CardSchema.shape.faction.optional(),
  cards: z.array(z.object({
    card_id: z.string(),
    quantity: z.number().min(1).max(3),
  })),
  hero_id: z.string(),
  is_public: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// API response schemas
export const CardListResponseSchema = BaseResponseSchema.extend({
  cards: z.array(CardSchema),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const DeckListResponseSchema = BaseResponseSchema.extend({
  decks: z.array(DeckSchema),
  total: z.number().optional(),
});

export const HealthCheckResponseSchema = z.object({
  status: z.enum(["healthy", "degraded", "unhealthy"]),
  version: z.string(),
  timestamp: z.string().datetime(),
  services: z.record(z.object({
    status: z.enum(["up", "down", "degraded"]),
    response_time: z.number().optional(),
    last_check: z.string().datetime().optional(),
  })),
});

// Type exports
export type BaseResponse = z.infer<typeof BaseResponseSchema>;
export type User = z.infer<typeof UserSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type Card = z.infer<typeof CardSchema>;
export type Deck = z.infer<typeof DeckSchema>;
export type CardListResponse = z.infer<typeof CardListResponseSchema>;
export type DeckListResponse = z.infer<typeof DeckListResponseSchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;

// Validation helper functions
export function validateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("API Response validation failed:", error.errors);
      throw new Error(`Invalid API response format: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}

// Safe parsing with defaults
export function safeParseApiResponse<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  defaultValue: T
): T {
  const result = schema.safeParse(data);
  if (result.success) {
    return result.data;
  }

  console.warn("API Response validation failed, using default:", result.error.errors);
  return defaultValue;
}

// Request validation schemas
export const LoginRequestSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(1),
}).refine(data => data.username || data.email, {
  message: "Either username or email must be provided",
});

export const CreateDeckRequestSchema = z.object({
  name: z.string().min(1).max(50),
  faction_primary: CardSchema.shape.faction,
  faction_secondary: CardSchema.shape.faction.optional(),
  hero_id: z.string(),
  cards: z.array(z.object({
    card_id: z.string(),
    quantity: z.number().min(1).max(3),
  })).min(30).max(50),
  is_public: z.boolean().default(false),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type CreateDeckRequest = z.infer<typeof CreateDeckRequestSchema>;