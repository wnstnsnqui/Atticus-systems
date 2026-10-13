import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Locator, type Page } from "@playwright/test";

// End to end checks for spec 0002 (design system and motion), run on /styleguide
// against a production build.

const STYLEGUIDE = "/styleguide";

const RGB = {
  void: "rgb(0, 0, 0)",
  base: "rgb(14, 13, 18)",
  raised: "rgb(21, 20, 27)",
  fieldLine: "rgb(110, 105, 148)",
  violet: "rgb(169, 155, 255)",
  button: "rgb(214, 213, 226)",
  ink: "rgb(14, 13, 18)",
  red: "rgb(255, 107, 107)",
} as const;

const style = (locator: Locator, property: string, pseudo?: string) =>
  locator.evaluate(
    (element, [name, pseudoElement]) =>
      getComputedStyle(element, pseudoElement ?? null).getPropertyValue(name ?? ""),
    [property, pseudo] as const,
  );

const opacity = (locator: Locator) => style(locator, "opacity");
const transform = (locator: Locator) => style(locator, "transform");

const IDENTITY = /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/;

// The first reveal block in the type section, well below the first viewport.
const typeReveal = (page: Page) => page.locator("#type [data-reveal]").first();

// A revealing glow, far below the first viewport.
const revealingGlow = (page: Page) => page.locator('#surfaces [data-glow="cyan"]');

const statusDot = (page: Page) => page.locator("#components [aria-hidden].bg-green").first();

function collectConsoleErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
}

// Reads one page pixel (page coordinates, taken at scroll 0) as [r, g, b] by
// decoding a 1px full page screenshot in the browser.
async function pixel(page: Page, x: number, y: number): Promise<readonly number[]> {
  const png = await page.screenshot({ fullPage: true, clip: { x, y, width: 1, height: 1 } });
  return page.evaluate(async (data) => {
    const image = new Image();
    image.src = `data:image/png;base64,${data}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    context?.drawImage(image, 0, 0);
    return Array.from(context?.getImageData(0, 0, 1, 1).data.slice(0, 3) ?? []);
  }, png.toString("base64"));
}

test.describe("scroll reveals", () => {
  test.use({ reducedMotion: "no-preference" });

  test("reveal once on scroll and never replay", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const block = typeReveal(page);

    expect(await opacity(block)).toBe("0");

    await block.scrollIntoViewIfNeeded();
    await expect.poll(() => opacity(block)).toBe("1");
    await expect.poll(() => transform(block)).toMatch(IDENTITY);

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

test.describe("glows", () => {
  test.use({ reducedMotion: "no-preference" });

  test("the hero glow is visible from the first paint", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const glow = page.locator("#intro [data-glow]");

    await expect(glow).not.toHaveAttribute("data-reveal");
    expect(await opacity(glow)).toBe("1");
  });

  test("a revealing glow fades in once over about 1200ms, then stays still", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const glow = revealingGlow(page);

    expect(await opacity(glow)).toBe("0");
    await glow.scrollIntoViewIfNeeded();
    await expect(glow).toHaveAttribute("data-in", "");

    await page.waitForTimeout(400);
    const midway = Number(await opacity(glow));
    expect(midway).toBeGreaterThan(0);
    expect(midway).toBeLessThan(1);

    await expect.poll(() => opacity(glow), { timeout: 3000 }).toBe("1");
    await expect.poll(() => glow.evaluate((element) => element.getAnimations().length)).toBe(0);
  });

  test("the violet blue glow stacks two gradients", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const image = await style(page.locator("#intro [data-glow]"), "background-image");

    expect(image.match(/radial-gradient/g)).toHaveLength(2);
  });
});

test.describe("surfaces", () => {
  test("the page is base, and the void hero fades into base with no hard edge", async ({
    page,
  }) => {
    await page.goto(STYLEGUIDE);
    const hero = page.locator("#intro");

    expect(await style(page.locator("body"), "background-color")).toBe(RGB.base);

    const box = await hero.boundingBox();
    if (!box) throw new Error("hero has no box");
    expect(await pixel(page, box.x + 1, box.y + 1)).toEqual([0, 0, 0]);

    const bottom = await pixel(page, box.x + 1, box.y + box.height - 1);
    [14, 13, 18].forEach((channel, index) => {
      expect(Math.abs((bottom[index] ?? 0) - channel)).toBeLessThanOrEqual(1);
    });
  });

  test("both tones carry the dot texture and cards cover it", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    for (const tone of ["#intro", "#color"]) {
      expect(await style(page.locator(tone), "background-image")).toContain("radial-gradient");
    }

    const card = page.locator("#intro .rounded-card").first();
    expect(await style(card, "background-image")).toBe("none");
    expect(await style(card, "background-color")).toBe(RGB.raised);
  });
});

test.describe("hover halo", () => {
  test.use({ reducedMotion: "no-preference" });

  test("hovering a glowing card lights its halo behind the surface", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const surface = page.locator(".group\\/card > .rounded-card");
    const halo = page.locator(".group\\/card > .glow-halo");

    await surface.scrollIntoViewIfNeeded();
    const fill = await style(surface, "background-color");
    expect(await opacity(halo)).toBe("0");

    await surface.hover();
    await expect.poll(() => opacity(halo)).toBe("1");
    expect(await style(surface, "background-color")).toBe(fill);

    const covered = await surface.evaluate((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();
      const hit = document.elementFromPoint(x + width / 2, y + height / 2);
      return hit !== null && element.contains(hit);
    });
    expect(covered).toBe(true);
  });
});

test.describe("forced colors", () => {
  test.use({ forcedColors: "active" });

  test("hides glows and gives cards, buttons, and fields a solid border", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    expect(await style(page.locator("#intro [data-glow]"), "display")).toBe("none");

    for (const locator of [
      page.locator("#intro .rounded-card").first(),
      page.getByRole("button", { name: "Send Inquiry" }),
      page.getByRole("textbox", { name: "Name" }),
    ]) {
      expect(await style(locator, "border-top-style")).toBe("solid");
      expect(await style(locator, "border-top-width")).toBe("1px");
    }
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
    expect(await transform(block)).toMatch(IDENTITY);
  });

  test("glows fade in within 300ms", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const glow = revealingGlow(page);

    await glow.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    expect(await opacity(glow)).toBe("1");
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

  test("the button does not lift on hover", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const button = page.getByRole("button", { name: "Send Inquiry" });

    await button.hover();
    await page.waitForTimeout(300);
    expect(await style(button, "translate")).toBe("none");
  });

  test("the status halo is hidden, leaving a static dot", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const dot = statusDot(page);

    expect(await style(dot, "display", "::after")).toBe("none");
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

  test("hovering a button lifts it 1px", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const button = page.getByRole("button", { name: "Send Inquiry" });

    await button.hover();
    await expect.poll(() => style(button, "translate")).toBe("0px -1px");
  });

  test("the status halo pulses", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    expect(await style(statusDot(page), "animation-name", "::after")).toBe("status-pulse");
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("every reveal target, glows included, is visible and in place", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    const states = await page
      .locator("[data-reveal]")
      .evaluateAll((elements) =>
        elements.map((element) => [
          getComputedStyle(element).opacity,
          getComputedStyle(element).transform,
          element.hasAttribute("data-glow"),
        ]),
      );
    expect(states.some(([, , isGlow]) => isGlow)).toBe(true);
    states.forEach(([elementOpacity, elementTransform]) => {
      expect(elementOpacity).toBe("1");
      expect(elementTransform).toBe("none");
    });
  });
});

test.describe("keyboard focus", () => {
  const ring = (locator: Locator) =>
    locator.evaluate((element) => {
      const computed = getComputedStyle(element);
      return [
        computed.outlineStyle,
        computed.outlineWidth,
        computed.outlineColor,
        computed.outlineOffset,
      ];
    });

  test("links and buttons show a 2px violet outline only from the keyboard", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const button = page.getByRole("button", { name: "Send Inquiry" });

    await button.click();
    expect(await style(button, "outline-style")).toBe("none");

    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(button).toBeFocused();
    expect(await ring(button)).toEqual(["solid", "2px", RGB.violet, "3px"]);

    const link = page.getByRole("link", { name: "Initialize Pipeline" });
    await link.focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(link).toBeFocused();
    expect(await ring(link)).toEqual(["solid", "2px", RGB.violet, "3px"]);
  });

  test("text fields show a violet border and a 2px violet outline at a 2px offset", async ({
    page,
  }) => {
    await page.goto(STYLEGUIDE);
    const field = page.getByRole("textbox", { name: "Name" });

    await page.getByRole("button", { name: "Unavailable" }).scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Sending…" }).focus();
    await page.keyboard.press("Tab");
    await expect(field).toBeFocused();
    // The border color eases in over 150ms, so poll for the settled state.
    await expect.poll(() => style(field, "border-top-color")).toBe(RGB.violet);
    expect(await ring(field)).toEqual(["solid", "2px", RGB.violet, "2px"]);
  });
});

test.describe("buttons", () => {
  test("primary is a light fill with ink text, control radius, and the shadow", async ({
    page,
  }) => {
    await page.goto(STYLEGUIDE);
    const button = page.getByRole("button", { name: "Send Inquiry" });

    expect(await style(button, "background-color")).toBe(RGB.button);
    expect(await style(button, "color")).toBe(RGB.ink);
    expect(await style(button, "border-top-left-radius")).toBe("12px");
    expect(await style(button, "box-shadow")).toContain("inset");
    expect(
      await button.evaluate((element) => element.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(48);
  });

  test("secondary is raised with a field-line border", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const button = page.getByRole("button", { name: "See the Work" });

    expect(await style(button, "background-color")).toBe(RGB.raised);
    expect(await style(button, "border-top-color")).toBe(RGB.fieldLine);
  });

  test("the arrow is not in the accessibility tree", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    await expect(page.getByRole("button", { name: "Send Inquiry", exact: true })).toHaveCount(1);
    const tree = await page.getByRole("button", { name: "Send Inquiry" }).ariaSnapshot();
    expect(tree).not.toMatch(/img|svg/);
  });

  test("a pending button stays focusable and ignores click and Enter", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const button = page.getByRole("button", { name: "Sending…" });

    await expect(button).toHaveAttribute("aria-disabled", "true");
    await button.focus();
    await expect(button).toBeFocused();
    expect(await opacity(button)).toBe("1");
    expect(await style(button, "background-color")).toBe(RGB.button);

    await button.click({ force: true });
    await page.keyboard.press("Enter");
    await expect(button).toBeFocused();
    await expect(page).toHaveURL(new RegExp(`${STYLEGUIDE}$`));
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

  test("a field error is linked to its control and shown in red", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const field = page.getByRole("textbox", { name: "Work Email" });

    await expect(field).toHaveAttribute("aria-invalid", "true");
    await expect(field).toHaveAccessibleDescription(/Enter a valid email/);
    expect(await style(field, "border-top-color")).toBe(RGB.red);
    await expect(page.getByText("ERR //")).toBeVisible();
  });
});

test.describe("layout and type", () => {
  test("nothing scrolls sideways at 320px, even a display heading or a large glow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(STYLEGUIDE);

    await expect(page.getByText("Infrastructure that ships")).toBeVisible();
    await expect(page.locator("[data-glow]")).toHaveCount(8);
    const widths = await page.evaluate(() => [
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
      window.innerWidth,
    ]);
    expect(widths[0]).toBeLessThanOrEqual(widths[2] ?? 0);
    expect(widths[1]).toBeLessThanOrEqual(widths[2] ?? 0);
  });

  test("selection is violet with ink text", async ({ page }) => {
    await page.goto(STYLEGUIDE);
    const paragraph = page.locator("main p").first();

    expect(await style(paragraph, "background-color", "::selection")).toBe(RGB.violet);
    expect(await style(paragraph, "color", "::selection")).toBe(RGB.ink);
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

    await expect(page.locator("#color li")).toHaveCount(22);
    await expect(page.getByText(/^#A99BFF · \d+\.\d{2}:1 on base$/)).toBeVisible();
    await expect(page.getByText(/^#0E0D12 · \d+\.\d{2}:1 heading on it$/).first()).toBeVisible();
  });

  test("has no WCAG A or AA violations", async ({ page }) => {
    await page.goto(STYLEGUIDE);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
