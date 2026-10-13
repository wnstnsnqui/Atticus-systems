import { describe, expect, it, vi } from "vitest";

// next/font is a compiler transform that only runs inside the Next.js build.
vi.mock("./fonts", () => ({ fontVariables: "font-vars" }));

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

describe("root layout markup", () => {
  it("ships a noscript style that shows reveal content without JavaScript", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://atticus.systems");
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { createElement } = await import("react");

    const { default: RootLayout } = await loadLayout();
    const html = renderToStaticMarkup(
      createElement(RootLayout, { children: "page", params: Promise.resolve({}) }),
    );

    expect(html).toContain(
      "<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>",
    );
    expect(html).toContain('class="font-vars"');
  });
});
