import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// env.ts validates process.env when it is imported, so each case stubs the
// environment first and then imports a fresh copy of the module.
async function loadEnv() {
  vi.resetModules();
  return (await import("./env")).env;
}

describe("env", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://atticus.systems");
    vi.stubEnv("VERCEL_ENV", undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exposes the site URL when it is a valid URL", async () => {
    const env = await loadEnv();

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("https://atticus.systems");
  });

  it("accepts a localhost origin for local development", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://localhost:3000");

    const env = await loadEnv();

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("fails loudly when the site URL is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined);

    await expect(loadEnv()).rejects.toThrow("Invalid environment variables");
    expect(console.error).toHaveBeenCalledWith(
      "Invalid environment variables:",
      expect.stringContaining("NEXT_PUBLIC_SITE_URL"),
    );
  });

  it("fails when the site URL is empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");

    await expect(loadEnv()).rejects.toThrow("Invalid environment variables");
  });

  it("fails when the site URL is not a URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "atticus.systems");

    await expect(loadEnv()).rejects.toThrow("Invalid environment variables");
  });

  it("leaves VERCEL_ENV undefined when running outside Vercel", async () => {
    const env = await loadEnv();

    expect(env.VERCEL_ENV).toBeUndefined();
  });

  it.each(["production", "preview", "development"] as const)(
    "accepts VERCEL_ENV=%s",
    async (value) => {
      vi.stubEnv("VERCEL_ENV", value);

      const env = await loadEnv();

      expect(env.VERCEL_ENV).toBe(value);
    },
  );

  it("rejects an unknown VERCEL_ENV, so the noindex switch never guesses", async () => {
    vi.stubEnv("VERCEL_ENV", "staging");

    await expect(loadEnv()).rejects.toThrow("Invalid environment variables");
    expect(console.error).toHaveBeenCalledWith(
      "Invalid environment variables:",
      expect.stringContaining("VERCEL_ENV"),
    );
  });
});
