export type RetryPolicyType = 'NONE' | 'FIXED_DELAY' | 'EXPONENTIAL_BACKOFF';

export interface RetryStrategy {
  policy: RetryPolicyType;
  maxAttempts: number;
  initialDelayMs?: number;
  /** Optional function to determine if an error is transient / retryable */
  isRetryable?: (error: Error | string) => boolean;
}

export const DEFAULT_RETRY_STRATEGY: RetryStrategy = {
  policy: 'NONE',
  maxAttempts: 1,
};

/**
 * Calculate delay in ms before next retry attempt.
 */
export function calculateRetryDelay(strategy: RetryStrategy, attempt: number): number {
  if (strategy.policy === 'NONE' || attempt >= strategy.maxAttempts) return 0;
  const initial = strategy.initialDelayMs || 1000;

  if (strategy.policy === 'FIXED_DELAY') {
    return initial;
  }

  if (strategy.policy === 'EXPONENTIAL_BACKOFF') {
    return initial * Math.pow(2, attempt - 1);
  }

  return 0;
}

/**
 * Evaluate whether an error is retryable under a given strategy.
 */
export function shouldRetryError(strategy: RetryStrategy, attempt: number, error: Error | string): boolean {
  if (strategy.policy === 'NONE') return false;
  if (attempt >= strategy.maxAttempts) return false;
  if (strategy.isRetryable) {
    return strategy.isRetryable(error);
  }
  // Default: retry transient errors (network timeouts, db connection errors), skip validation errors
  const errStr = typeof error === 'string' ? error : error.message || '';
  if (errStr.includes('VALIDATION_ERROR') || errStr.includes('FORBIDDEN') || errStr.includes('NOT_FOUND')) {
    return false;
  }
  return true;
}
