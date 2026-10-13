import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Smoke tests for the spec 0001 scaffold, run against a production build.

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("home page", () => {
  // covers: verify.md "boots locally" and "builds clean"
  test("loads with no console or CSP errors", async ({ page }) => {
    const errors = collectConsoleErrors(page);

    const response = await page.goto("/");
    await page.waitForLoadState("networkidle");

    expect(response?.status()).toBe(200);
    expect(errors).toEqual([]);
  });

  test("declares English as the document language", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("renders on a pure black background", async ({ page }) => {
    await page.goto("/");

    const background = await page.evaluate(
      () => getComputedStyle(document.documentElement).backgroundColor,
    );
    expect(background).toBe("rgb(0, 0, 0)");
  });

  test("has no WCAG A or AA violations", async ({ page }) => {
    await page.goto("/");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});

test.describe("in page scrolling", () => {
  test("scrolls smoothly by default", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto("/");

    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behavior).toBe("smooth");
  });

  test("jumps instantly when the visitor prefers reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const behavior = await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
    expect(behavior).toBe("auto");
  });
});

// covers: verify.md "security and noindex headers"
test.describe("response headers", () => {
  test("sends the strict security baseline", async ({ request }) => {
    const response = await request.get("/");
    const headers = response.headers();

    const csp = headers["content-security-policy"] ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).not.toContain("unsafe-eval");
    expect(headers["strict-transport-security"]).toContain("max-age=");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["permissions-policy"]).toContain("camera=()");
  });

  test("keeps non production deployments out of search results", async ({ request }) => {
    const response = await request.get("/");

    expect(response.headers()["x-robots-tag"]).toBe("noindex");
  });

  test("applies the same headers to unknown routes", async ({ request }) => {
    const response = await request.get("/does-not-exist");

    expect(response.headers()["x-frame-options"]).toBe("DENY");
    expect(response.headers()["content-security-policy"]).toBeTruthy();
  });
});

// covers: verify.md "not-found.tsx"
test.describe("unknown route", () => {
  test("returns 404 and offers a way back home", async ({ page }) => {
    const response = await page.goto("/does-not-exist");

    expect(response?.status()).toBe(404);
    await page.getByRole("link", { name: /home/i }).click();
    await expect(page).toHaveURL("/");
  });

  test("has no WCAG A or AA violations", async ({ page }) => {
    await page.goto("/does-not-exist");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
