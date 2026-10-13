import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

// End to end checks for spec 0002 (design system and motion), run on /styleguide
// against a production build.

const STYLEGUIDE = "/styleguide";

const opacity = (locator: Locator) =>
  locator.evaluate((element) => getComputedStyle(element).opacity);

const transform = (locator: Locator) =>
  locator.evaluate((element) => getComputedStyle(element).transform);

// The first reveal block in the type section, well below the first viewport.
const typeReveal = (page: Page) => page.locator("#type [data-reveal]").first();

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

test.describe("scroll reveals", () => {
  test.use({ reducedMotion: "no-preference" });

  test("reveal once on scroll and never replay", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const block = typeReveal(page);

    expect(await opacity(block)).toBe("0");

    await block.scrollIntoViewIfNeeded();
    await expect.poll(() => opacity(block)).toBe("1");
    await expect.poll(() => transform(block)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    expect(await opacity(block)).toBe("1");
  });

  test("reveal a block taller than the viewport", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 120 });
    await page.goto(STYLEGUIDE);
    const block = page.locator("#motion .grid > [data-reveal]").first();

    expect(
      await block.evaluate((element) => element.getBoundingClientRect().height),
    ).toBeGreaterThan(120);
    await block.scrollIntoViewIfNeeded();
    await expect.poll(() => opacity(block)).toBe("1");
  });

  test("reveal headings word by word", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const words = page.locator("#motion h3 [aria-hidden] .inline-block[data-reveal]");

    await expect(words).toHaveCount(6);
    await words.first().scrollIntoViewIfNeeded();
    await expect.poll(() => opacity(words.last())).toBe("1");
  });
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("reveals fade in place within 300ms", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const block = typeReveal(page);

    await block.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    expect(await opacity(block)).toBe("1");
    expect(await transform(block)).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  });

  test("heading words appear together as one fade", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const heading = page.locator("#motion h3");
    const words = heading.locator("[aria-hidden] .inline-block[data-reveal]");

    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const states = await words.evaluateAll((elements) =>
      elements.map((element) => getComputedStyle(element).opacity),
    );
    expect(new Set(states)).toEqual(new Set(["1"]));
  });

  test("the letter roll stays still on hover", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const link = page.getByRole("link", { name: "Initialize Pipeline" });

    await link.hover();
    await page.waitForTimeout(400);
    expect(await transform(link.locator(".letter-roll-char").first())).toBe("none");
  });

  test("the status halo is hidden, leaving a static dot", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const dot = page.locator("#components [aria-hidden].bg-amber").first();

    const haloDisplay = await dot.evaluate(
      (element) => getComputedStyle(element, "::after").display,
    );
    expect(haloDisplay).toBe("none");
    await expect(dot).toBeVisible();
  });
});

test.describe("full motion details", () => {
  test.use({ reducedMotion: "no-preference" });

  test("hovering a link rolls its letters up", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const link = page.getByRole("link", { name: "Initialize Pipeline" });

    await link.hover();
    await expect
      .poll(() => transform(link.locator(".letter-roll-char").last()))
      .toMatch(/^matrix\(1, 0, 0, 1, 0, -\d+(\.\d+)?\)$/);
  });

  test("the status halo pulses", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const dot = page.locator("#components [aria-hidden].bg-amber").first();

    const animation = await dot.evaluate(
      (element) => getComputedStyle(element, "::after").animationName,
    );
    expect(animation).toBe("status-pulse");
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every reveal target is visible and in place", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    const states = await page
      .locator("[data-reveal]")
      .evaluateAll((elements) =>
        elements.map((element) => [
          getComputedStyle(element).opacity,
          getComputedStyle(element).transform,
        ]),
      );
    expect(states.length).toBeGreaterThan(0);
    states.forEach(([elementOpacity, elementTransform]) => {
      expect(elementOpacity).toBe("1");
      expect(elementTransform).toBe("none");
    });
  });
});

test.describe("keyboard focus", () => {
  test("links and buttons show a 2px amber outline only from the keyboard", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const button = page.getByRole("button", { name: "Send Inquiry" });

    await button.click();
    expect(await button.evaluate((element) => getComputedStyle(element).outlineStyle)).toBe("none");

    const link = page.getByRole("link", { name: "Initialize Pipeline" });
    await link.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(link).toBeFocused();
    const outline = await link.evaluate((element) => {
      const style = getComputedStyle(element);
      return [style.outlineStyle, style.outlineWidth, style.outlineColor, style.outlineOffset];
    });
    expect(outline).toEqual(["solid", "2px", "rgb(255, 176, 0)", "4px"]);
  });

  test("text fields show a 2px amber underline and no outline", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const field = page.getByRole("textbox", { name: "Name" });

    await page.getByRole("button", { name: "Sending…" }).focus();
    await page.keyboard.press("Tab");
    await expect(field).toBeFocused();
    // The underline color eases in over 150ms, so poll for the settled state.
    await expect
      .poll(() =>
        field.evaluate((element) => {
          const computed = getComputedStyle(element);
          return [computed.borderBottomWidth, computed.borderBottomColor, computed.outlineStyle];
        }),
      )
      .toEqual(["2px", "rgb(255, 176, 0)", "none"]);
  });
});

test.describe("accessible names and states", () => {
  test("split text is announced once, as whole words", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    await expect(page.getByRole("link", { name: "Initialize Pipeline", exact: true })).toHaveCount(
      1,
    );
    await expect(
      page.getByRole("heading", { name: "Calm motion that respects every visitor", exact: true }),
    ).toHaveCount(1);
  });

  test("a pending button stays focusable but disabled", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const button = page.getByRole("button", { name: "Sending…" });

    await expect(button).toHaveAttribute("aria-disabled", "true");
    await button.focus();
    await expect(button).toBeFocused();
    expect(await opacity(button)).toBe("1");
  });

  test("a field error is linked to its control", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const field = page.getByRole("textbox", { name: "Work Email" });

    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAccessibleDescription(/Enter a valid email/);
  });
});

test.describe("layout and type", () => {
  test("nothing scrolls sideways at 320px, even a display heading", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(STYLEGUIDE);

    await expect(page.getByText("Infrastructure that ships")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      320,
    );
  });

  test("selection is white with black text", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    const selection = await page
      .locator("main p")
      .first()
      .evaluate((element) => {
        const style = getComputedStyle(element, "::selection");
        return [style.backgroundColor, style.color];
      });
    expect(selection).toEqual(["rgb(255, 255, 255)", "rgb(0, 0, 0)"]);
  });
});

test.describe("fonts, layout shift, and CSP", () => {
  for (const path of ["/", STYLEGUIDE]) {
    test(`${path} logs no errors and loads fonts from its own origin`, async ({
      page,
      baseURL,
    }) => {
      const errors = collectConsoleErrors(page);
      const fontOrigins = new Set<string>();
      page.on("request", (request) => {
        if (request.resourceType() === "font") fontOrigins.add(new URL(request.url()).origin);
      });

      await page.goto(path);
      await page.waitForLoadState("networkidle");

      expect(errors).toEqual([]);
      expect([...fontOrigins].every((origin) => origin === new URL(baseURL ?? "").origin)).toBe(
        true,
      );
    });
  }

  test("the styleguide shifts less than 0.01 while loading", async ({ page }) => {
    await page.addInitScript(() => {
      const scope = window as unknown as { __cls: number };
      scope.__cls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as unknown as {
          value: number;
          hadRecentInput: boolean;
        }[]) {
          if (!entry.hadRecentInput) scope.__cls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    await page.goto(STYLEGUIDE);
    await page.waitForLoadState("networkidle");
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);

    const cls = await page.evaluate(() => (window as unknown as { __cls: number }).__cls);
    expect(cls).toBeLessThan(0.01);
  });
});

test.describe("styleguide page", () => {
  test("is kept out of search results", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("shows a swatch with its contrast ratio for every color token", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    await expect(page.locator("#color li")).toHaveCount(8);
    await expect(page.getByText("#FFB000 · 11.46:1")).toBeVisible();
  });

  test("has no WCAG A or AA violations", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
