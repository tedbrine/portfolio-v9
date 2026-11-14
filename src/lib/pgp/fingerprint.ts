export const FINGERPRINT_URL =
  "https://openpgpkey.ted.ac/.well-known/openpgpkey/ted.ac/hu/aeii9rmagouy1owpp7e5ftpxjof7h41n.fingerprint";

const DEFAULT_TIMEOUT_MS = 2_500;
const DEFAULT_REVALIDATE_MS = 60 * 60 * 1_000;

type FingerprintClientOptions = {
  fetch?: typeof fetch;
  timeoutMs?: number;
  revalidateMs?: number;
  now?: () => number;
  warn?: (message: string) => void;
};

class FingerprintResponseError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(`HTTP ${status}`);
    this.name = "FingerprintResponseError";
    this.status = status;
  }
}

const failureReason = (error: unknown) => {
  if (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  ) {
    return "timeout";
  }

  if (error instanceof FingerprintResponseError) {
    return error.message;
  }

  if (error instanceof Error) {
    const cause = error.cause;
    if (
      cause &&
      typeof cause === "object" &&
      "code" in cause &&
      typeof cause.code === "string"
    ) {
      return cause.code;
    }

    return error.message;
  }

  return "unknown error";
};

const isRetryable = (error: unknown) => {
  if (error instanceof FingerprintResponseError) {
    return error.status >= 500;
  }

  return true;
};

const readFingerprint = async (fetchImpl: typeof fetch, timeoutMs: number) => {
  // Bypass Next's fetch cache. Stale `next.revalidate` entries refresh in the
  // background, and Next logs that failure with console.error.
  const response = await fetchImpl(FINGERPRINT_URL, {
    cache: "no-store",
    headers: { accept: "text/plain" },
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (!response.ok) {
    throw new FingerprintResponseError(response.status);
  }

  const text = (await response.text()).trim();
  if (!text) {
    throw new Error("empty fingerprint");
  }

  return text;
};

export const createPgpFingerprintClient = ({
  fetch: fetchImpl = fetch,
  timeoutMs = DEFAULT_TIMEOUT_MS,
  revalidateMs = DEFAULT_REVALIDATE_MS,
  now = Date.now,
  warn = (message) => {
    console.warn(message);
  },
}: FingerprintClientOptions = {}) => {
  let cached: { value: string; freshUntil: number } | null = null;

  return async function getPgpFingerprint() {
    const currentTime = now();
    if (cached && currentTime < cached.freshUntil) {
      return cached.value;
    }

    let failure: unknown;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const value = await readFingerprint(fetchImpl, timeoutMs);
        cached = { value, freshUntil: currentTime + revalidateMs };
        return value;
      } catch (error) {
        failure = error;
        if (attempt === 0 && isRetryable(error)) {
          continue;
        }
        break;
      }
    }

    warn(`PGP fingerprint lookup failed (${failureReason(failure)})`);
    return cached?.value ?? null;
  };
};

export const getPgpFingerprint = createPgpFingerprintClient();
