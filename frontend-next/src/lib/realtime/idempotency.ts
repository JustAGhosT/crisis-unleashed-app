export function generateIdempotencyKey(prefix = "deck"): string {
  if (typeof crypto !== "undefined") {
    const uuid = (crypto as { randomUUID?: () => string }).randomUUID?.();
    if (uuid) return `${prefix}_${uuid}`;
  }
  // Fallback
  const rnd = Math.random().toString(36).slice(2);
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}_${rnd}`;
}
