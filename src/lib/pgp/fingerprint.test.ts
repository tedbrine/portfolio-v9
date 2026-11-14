import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { createPgpFingerprintClient, FINGERPRINT_URL } from "./fingerprint.ts";

const fingerprint = "ABCD 1234 EFGH 5678";

const jsonResponse = (body: string, status = 200) =>
  new Response(body, { status });

describe("createPgpFingerprintClient", () => {
  const warnings: string[] = [];
  const errors: unknown[][] = [];
  const originalError = console.error;

  afterEach(() => {
    warnings.length = 0;
    errors.length = 0;
    console.error = originalError;
  });

  const unexpectedErrors = () =>
    errors.filter(
      (args) => !String(args[0]).includes("MODULE_TYPELESS_PACKAGE_JSON"),
    );

  const client = (
    fetchImpl: typeof fetch,
    options?: { revalidateMs?: number; timeoutMs?: number; now?: () => number },
  ) => {
    console.error = (...args: unknown[]) => {
      errors.push(args);
    };

    return createPgpFingerprintClient({
      fetch: fetchImpl,
      revalidateMs: options?.revalidateMs ?? 60_000,
      timeoutMs: options?.timeoutMs ?? 1_000,
      now: options?.now ?? (() => 0),
      warn: (message) => {
        warnings.push(message);
      },
    });
  };

  it("returns the fingerprint when the lookup succeeds", async () => {
    const calls: Array<{ url: string; cache?: RequestCache }> = [];
    const getFingerprint = client(async (input, init) => {
      calls.push({
        url: String(input),
        cache: init?.cache,
      });
      assert.ok(init?.signal);
      return jsonResponse(`${fingerprint}\n`);
    });

    assert.equal(await getFingerprint(), fingerprint);
    assert.deepEqual(calls, [{ url: FINGERPRINT_URL, cache: "no-store" }]);
    assert.deepEqual(warnings, []);
    assert.deepEqual(unexpectedErrors(), []);
  });

  it("retries a timed-out lookup once and then falls back", async () => {
    let calls = 0;
    const getFingerprint = client(
      (_input, init) => {
        calls += 1;
        return new Promise((_resolve, reject) => {
          const signal = init?.signal;
          assert.ok(signal);
          // AbortSignal.timeout does not keep the event loop alive on its own.
          const keepAlive = setTimeout(() => {}, 1_000);
          const fail = () => {
            clearTimeout(keepAlive);
            reject(signal.reason);
          };
          if (signal.aborted) {
            fail();
            return;
          }
          signal.addEventListener("abort", fail, { once: true });
        });
      },
      { timeoutMs: 20 },
    );

    assert.equal(await getFingerprint(), null);
    assert.equal(calls, 2);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /timeout/i);
    assert.equal(unexpectedErrors().length, 0);
  });

  it("retries one network failure and returns the successful response", async () => {
    let calls = 0;
    const getFingerprint = client(async () => {
      calls += 1;
      if (calls === 1) {
        throw Object.assign(new TypeError("fetch failed"), {
          cause: Object.assign(new Error("write ETIMEDOUT"), {
            code: "ETIMEDOUT",
          }),
        });
      }
      return jsonResponse(fingerprint);
    });

    assert.equal(await getFingerprint(), fingerprint);
    assert.equal(calls, 2);
    assert.deepEqual(warnings, []);
    assert.deepEqual(unexpectedErrors(), []);
  });

  it("does not retry a client error", async () => {
    let calls = 0;
    const getFingerprint = client(async () => {
      calls += 1;
      return jsonResponse("missing", 404);
    });

    assert.equal(await getFingerprint(), null);
    assert.equal(calls, 1);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /404/);
    assert.equal(unexpectedErrors().length, 0);
  });

  it("reuses a fresh fingerprint and serves it when a later lookup fails", async () => {
    let now = 1_000;
    let calls = 0;
    const getFingerprint = client(
      async () => {
        calls += 1;
        if (calls === 1) return jsonResponse(fingerprint);
        throw new TypeError("fetch failed");
      },
      {
        revalidateMs: 500,
        now: () => now,
      },
    );

    assert.equal(await getFingerprint(), fingerprint);
    assert.equal(await getFingerprint(), fingerprint);
    assert.equal(calls, 1);

    now += 500;
    assert.equal(await getFingerprint(), fingerprint);
    assert.equal(calls, 3);
    assert.equal(warnings.length, 1);
    assert.equal(unexpectedErrors().length, 0);
  });
});
