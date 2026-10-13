import { describe, expect, it, vi } from "vitest";

// The layout reads the validated env at import time, so stub it first.
async function loadLayout() {
  vi.resetModules();
  return import("./layout");
}

describe("root layout metadata", () => {
  it("uses NEXT_PUBLIC_SITE_URL as the metadata base for absolute URLs", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://atticus.systems");

    const { metadata } = await loadLayout();

    expect(metadata.metadataBase?.toString()).toBe("https://atticus.systems/");
  });

  it("sets a title and description", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://atticus.systems");

    const { metadata } = await loadLayout();

    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
  });
});
