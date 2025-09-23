/**
 * Cookie management utilities for theme persistence
 */

// Cookie configuration constants
export const THEME_COOKIE_CONFIG = {
  name: "theme:active",
  path: "/",
  maxAge: 60 * 60 * 24 * 90, // 90 days in seconds
} as const;

/**
 * Sets a cookie value with proper configuration
 */
export function setThemeCookie(value: string): void {
  if (typeof document === "undefined") return;

  const { name, path, maxAge } = THEME_COOKIE_CONFIG;
  document.cookie = `${name}=${value}; Path=${path}; Max-Age=${maxAge}`;
}

/**
 * Gets a cookie value by name
 */
export function getCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }
  return null;
}

/**
 * Gets the theme cookie value
 */
export function getThemeCookie(): string | null {
  return getCookieValue(THEME_COOKIE_CONFIG.name);
}