/**
 * SpeakUp Security Suite - Rate Limiter Engine
 * In-memory sliding window rate limiter for API & Auth protection.
 */

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export interface RateLimitOptions {
  limit?: number; // Max allowed requests in window
  windowMs?: number; // Time window in milliseconds
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): { success: boolean; limit: number; remaining: number; resetMs: number } {
  const limit = options.limit || 10;
  const windowMs = options.windowMs || 60 * 1000; // Default 1 minute
  const now = Date.now();

  const record = store.get(identifier);

  if (!record || now > record.resetTime) {
    // Window expired or new identifier
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, limit, remaining: limit - 1, resetMs: windowMs };
  }

  if (record.count >= limit) {
    // Rate limit exceeded
    return {
      success: false,
      limit,
      remaining: 0,
      resetMs: Math.max(0, record.resetTime - now),
    };
  }

  record.count += 1;
  store.set(identifier, record);

  return {
    success: true,
    limit,
    remaining: limit - record.count,
    resetMs: Math.max(0, record.resetTime - now),
  };
}
