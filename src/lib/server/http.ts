export interface RetryOptions {
  retries?: number;
  timeoutMs?: number;
  retryDelayMs?: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithTimeout(
  input: string | URL | Request,
  init: RequestInit = {},
  timeoutMs: number = 12_000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchWithRetry(
  input: string | URL | Request,
  init: RequestInit = {},
  options: RetryOptions = {}
): Promise<Response> {
  const retries = options.retries ?? 1;
  const timeoutMs = options.timeoutMs ?? 12_000;
  const retryDelayMs = options.retryDelayMs ?? 300;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(input, init, timeoutMs);
      if (response.ok || response.status < 500 || attempt === retries) {
        return response;
      }
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        throw error;
      }
    }

    await sleep(retryDelayMs * (attempt + 1));
  }

  throw lastError instanceof Error ? lastError : new Error('Request failed');
}
