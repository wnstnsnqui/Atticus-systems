# 0002. Rationale: design system and motion foundation

Decision record for [index.md](index.md). `/develop` builds from `index.md`. This file explains why.

## Context

Atticus is a single page, prerendered marketing site (spec 0001). Every section after this one (hero, connect, services, infrastructure, portfolio, footer, legal pages) needs the same colors, typefaces, spacing, interactive states, and scroll motion. Without a shared foundation, each section would invent its own values. On a design this restrained (black, white, one gray, one accent), small inconsistencies in tracking, spacing, or easing are exactly what makes a minimal site look unfinished instead of premium.

The scope fixes the palette and the tone: pure black, white headings, `#888888` body copy, Electric Amber `#FFB000` only for interactive and status elements, one sharp geometric sans, generous whitespace, no boxes or heavy borders, no gradients, and smooth transitions on scroll. You chose colejames.io as the reference for everything the scope leaves open. That site uses large headings with tight tracking, uppercase mono labels, 1px dividers, split text heading reveals, a letter stagger on button hover, and color transitions on links. It also uses purple tinted near black, glow blobs, bordered cards, GSAP, and Lenis, and has no reduced motion handling or focus styles. So the reference sets the feel, and the scope plus the accessibility baseline set the limits.

The hard constraints come from spec 0001 and `AGENTS.md`. The page must stay static (`ensureStatic`), so nothing can read request data. Motion for React owns all in page motion, React View Transitions are for route changes only, and smooth scrolling is native CSS. Fonts go through `next/font` with no third party origin, so the CSP stays unchanged. And WCAG AA contrast on black, full keyboard use, a visible amber focus, and `prefers-reduced-motion` support apply to every element. One more force: content that starts hidden for a reveal must not vanish for visitors without JavaScript or delay the first paint.

## Options considered

### Option 1: Tailwind theme tokens, your own primitives with Base UI for fields and buttons, Motion for reveals

All values become Tailwind v4 `@theme` tokens in `globals.css`. A small set of typed primitives (`cva` variants, `clsx` conditionals) covers layout, type, links, and status. `TextField` and `Button` sit on Base UI for correct label, error, and disabled wiring. Scroll reveals run on Motion through `LazyMotion`, while the hover letter roll and status pulse are pure CSS.

**Pros**:
- Uses exactly the stack spec 0001 already chose. Nothing to operate, and no runtime styling cost.
- Primitives fit this design exactly, with no third party look to strip off.
- Base UI handles the accessibility plumbing of form fields (label association, `aria-invalid`, descriptions, focusable disabled buttons), which is easy to get subtly wrong by hand.

**Cons**:
- You build and maintain every primitive yourself.
- Base UI powers only two components today, so it is a dependency carried mostly for the future (cookie notice, any menu).
- Motion values live in both TypeScript and CSS and need a test to stay in sync.

### Option 2: shadcn/ui as the component base, themed to the palette

Copy shadcn/ui components into the repo and retheme them to black, white, gray, and amber.

**Pros**:
- Many ready components, and a familiar pattern for other developers.
- Built on accessible primitives.

**Cons**:
- Its default look (rounded bordered boxes, subtle backgrounds, shadows) is the opposite of "no boxes, no gradients". Most of the work would be removing styling.
- Brings a larger dependency surface than a one page site needs.

### Option 3: CSS only motion (scroll driven animations) and native HTML only

Use CSS `animation-timeline: view()` for reveals, CSS for hover, and no UI library or Motion at all.

**Pros**:
- Zero JavaScript for motion. Reveals work without hydration and without JavaScript.
- Smallest possible bundle.

**Cons**:
- Scroll driven animations are still not supported in every major browser, so some visitors get no reveal or an inconsistent one.
- "Play once and stay" is awkward in pure CSS, since view timelines reverse on scroll back.
- Contradicts spec 0001, which made Motion the single system for in page motion.

### Option 4: Port the reference's stack (GSAP + ScrollTrigger, Lenis, split-type)

Recreate colejames.io's tooling directly.

**Pros**:
- Matches the reference most closely, and GSAP's timeline control is excellent.

**Cons**:
- Adds a second animation system next to Motion and a scroll library that spec 0001 rejected for native scrolling (Lenis changes scrolling feel and can fight assistive tech).
- More JavaScript on a page meant to be static and fast. The reference itself ships no reduced motion handling, so none of that comes for free.

## Rationale

Option 1 wins because it is the only option that fits all three forces at once: the fixed minimal palette, the stack spec 0001 already locked in, and the accessibility baseline. Tailwind tokens give one source for every value with no runtime cost. Hand built primitives match a design that is mostly typography and whitespace, where a component kit (Option 2) would mostly need its styling removed. Motion already ships with the stack, so the reveal pattern adds no new system, unlike Option 4. And Motion's `once` viewport plus `useReducedMotion` give exactly "play once, reduce to a fade" without the browser gaps of Option 3.

Two of your picks differed from my first recommendation, and both are sound:
- **Satoshi instead of Geist.** Satoshi has crisper geometric shapes and more personality. The cost is a font file committed by hand. Weight 500 for headings protects its thin strokes on pure black, and Geist Mono still pairs well as a neutral technical companion.
- **Base UI now instead of later.** Since you also asked for the form fields in this feature, Base UI earns its place now: `Field` gives correct label, description, error, and invalid wiring, and `Button`'s `focusableWhenDisabled` keeps keyboard focus during the pending submit in feature 5. Its cost is small, and the cookie notice in feature 12 is a likely second user.

The decisions I made inside your choices, with the runner up for each:
- **Exact token values and fluid formulas.** Interpolated linearly between a 375px and a 1440px viewport, the widths where phones and large desktops begin. Runner up: fixed steps per breakpoint, rejected because you chose fluid.
- **`#666666` underline for fields at rest.** A field's only visible boundary is a UI component, so WCAG 1.4.11 asks for 3:1. `#666666` gives 3.66:1. The decorative `#262626` hairline is used only where it is not the sole cue. Runner up: `#888888` underlines, which read as heavier than the brief's "thin line".
- **Field focus is an amber underline, not the outline ring.** A ring around a borderless field draws a box, against the brief. Thickening the underline to 2px amber is clearly visible. Runner up: the ring on fields too, if you prefer one uniform focus style.
- **Errors in amber with an `ERR //` marker.** This was your pick. Errors are status, and the text marker plus `aria-invalid` mean color is never the only cue.
- **Letter roll in pure CSS with an `::after` copy.** Each letter sits in a static clip span. An inner element slides up one line while its `::after` (content from `data-char`) rises into place, so the label is never duplicated in the accessibility tree. It runs only on hover capable pointers and with motion allowed. Runner up: a Motion driven stagger, rejected because a CSS hover needs no JavaScript and works before hydration. (The first draft used a `text-shadow` copy. The cross check showed a self clipping letter cannot reveal its own shadow, so it changed.)
- **`sr-only` full text plus `aria-hidden` fragments** for any split text. Some screen readers read inline block fragments one by one, and `aria-label` on links can break machine translation. Runner up: `aria-label` on the parent.
- **No JavaScript fallback via `<noscript><style>`**, keyed on `data-reveal`. It overrides Motion's server rendered inline styles with `!important`, costs no JavaScript, and is already allowed by the CSP (`style-src 'unsafe-inline'`). Runner up: a `js` class set by an inline script, which delays nothing but adds a script for the same result.
- **Reduced motion through both `MotionConfig reducedMotion="user"` and explicit reduced variants.** `MotionConfig` alone keeps the full 600ms opacity timing, while you asked for a short fade, so `Reveal` switches to 150ms opacity only variants with `useReducedMotion()`. The `MotionConfig` stays as a safety net for any future motion.
- **`/styleguide` gated on `VERCEL_ENV` at build time, proven in CI.** It is already validated, so no new variable is needed, and local e2e runs (no `VERCEL_ENV`) can test the page. Calling `notFound()` while prerendering under Cache Components is the documented path, but because a leak would publish an internal page, CI builds once with `VERCEL_ENV=production` and asserts the 404. Runner up: a separate `ENABLE_STYLEGUIDE` flag, which would just be one more thing to forget.
- **Motion values in TypeScript with a CSS mirror and an equality test.** Motion needs numbers in JavaScript and CSS hover effects need custom properties. Reading CSS variables at runtime from JavaScript would cost a layout read per component. Runner up: CSS variables only, with Motion reading them through `getComputedStyle`. Colors, by contrast, are never copied: the contrast test and `/styleguide` parse `globals.css` directly.
- **Geist Mono from the `geist` package, not `next/font/google`.** Same font, but bundled locally, so builds and CI never depend on reaching Google. Runner up: `next/font/google`, which works but makes builds flaky offline.
- **Reveal trigger `amount: "some"` with a 10% bottom margin.** A fixed share like 20% never fires for a block taller than five viewports on a small phone. Runner up: `amount: 0.2` with a rule against tall blocks.
- **Accepted risk: failed hydration hides reveal content.** A CSS failsafe timer would cover it but adds a moving part for a rare case on a static page. It is revisited if error tracking ever shows it.

### Reference study: colejames.io (2026-10-13)

What was taken: large headings with tight negative tracking, uppercase mono labels with positive tracking, sparing 1px dividers, word by word heading reveals, the letter stagger on CTA hover (about 10ms per letter), and quick color transitions on links.

What was left out, and why:
- Near black `#100f15` with purple tinted grays: the scope fixes pure `#000` and one gray.
- Glow blobs and blurred decorative shapes: the scope rules out colorful graphics and gradients.
- Bordered cards and pill buttons: the scope rules out boxes.
- GSAP, ScrollTrigger, Lenis, split-type, jQuery: spec 0001 fixes Motion and native scrolling.
- The nav that hides at the top and fades in: feature 4 decides it.
- No reduced motion handling and no focus styles in the reference: these are gaps to avoid, not patterns to copy.
