export function generateIdempotencyKey(prefix = "deck"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    // @ts-expect-error: randomUUID exists in modern browsers
    return `${prefix}_${crypto.randomUUID()}`;
  }
  // Fallback
  const rnd = Math.random().toString(36).slice(2);
  const ts = Date.now().toString(36);
  return `${prefix}_${ts}_${rnd}`;
}
