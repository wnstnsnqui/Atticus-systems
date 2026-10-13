import { describe, expect, it, vi } from "vitest";

// The page reads the validated env at import time, so stub it first.
async function loadPage() {
  vi.resetModules();
  vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://atticus.systems");
  return import("./page");
}

describe("styleguide route config", () => {
  it("opts into the ensureStatic build guard", async () => {
    const styleguide = await loadPage();

    expect(styleguide.ensureStatic).toBe("navigation");
  });

  it("keeps the page out of search results", async () => {
    const styleguide = await loadPage();

    expect(styleguide.metadata.robots).toEqual({ index: false, follow: false });
  });
});
