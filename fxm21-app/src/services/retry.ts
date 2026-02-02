export interface RetryPolicy {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  jitterMs: number;
}

export const defaultRetryPolicy: RetryPolicy = {
  maxAttempts: 3,
  baseDelayMs: 250,
  maxDelayMs: 2000,
  jitterMs: 100,
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const computeDelay = (attempt: number, policy: RetryPolicy): number => {
  const expDelay = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** (attempt - 1));
  const jitter = Math.floor(Math.random() * policy.jitterMs);
  return expDelay + jitter;
};

export async function withRetry<T>(
  action: () => Promise<T>,
  policy: RetryPolicy,
  onRetry?: (attempt: number, error: unknown) => void,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= policy.maxAttempts; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt < policy.maxAttempts) {
        onRetry?.(attempt, error);
        await delay(computeDelay(attempt, policy));
      }
    }
  }

  throw lastError;
}
