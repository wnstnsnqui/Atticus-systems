# 0002. Rationale: design system and motion foundation

Decision record for [index.md](index.md). `/develop` builds from `index.md`. This file explains why.

## Context

Atticus is a single page, prerendered marketing site (spec 0001). Every section after this one (hero, connect, services, infrastructure, portfolio, footer, legal pages) needs the same colors, typefaces, spacing, interactive states, and scroll motion. Without a shared foundation, each section would invent its own values. On a design this restrained (black, white, one gray, one accent), small inconsistencies in tracking, spacing, or easing are exactly what makes a minimal site look unfinished instead of premium.

The first version followed the scope's fixed palette: pure black, white headings, `#888888` body copy, Electric Amber `#FFB000` only for interactive and status elements, no boxes, no gradients. Built and verified, it read as too flat. You asked to revise it: base the system on Vercel's Geist, keep pure black only for a striking hero void, use a slightly tinted deep obsidian for the other sections and for terminal cards (depth, less eye strain, sharper type), and take the vibe of colejames.io: the textured dot background, the purple light from below, and its component style. So this revision has to add depth and decoration without losing what made the first version good: AA contrast everywhere, restraint, and a motion system that respects every visitor.

Two new forces come with the revision. Contrast now has to hold on four surfaces, not one, so a single "on black" check is no longer enough. And decoration (texture, glows, shadows) must never sit above text, never animate forever, and never cost layout shift or a new network origin.

The hard constraints come from spec 0001 and `AGENTS.md`. The page must stay static (`ensureStatic`), so nothing can read request data. Motion for React owns all in page motion, React View Transitions are for route changes only, and smooth scrolling is native CSS. Fonts go through `next/font` with no third party origin, so the CSP stays unchanged. And WCAG AA contrast, full keyboard use, a visible focus, and `prefers-reduced-motion` support apply to every element. One more force: content that starts hidden for a reveal must not vanish for visitors without JavaScript or delay the first paint.

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

## Revision options (2026-10-13)

The original options below decided the stack (tokens, own primitives, Base UI, Motion) and still stand. The revision weighed how to change the look:

### Revision option 1: retoken in place, Geist structure, Cole James component layer (chosen)

Keep every built primitive and the motion system. Replace the palette with a violet obsidian set organized by Geist's step roles, add radius, shadow, texture, and glow tokens, restyle the controls, and add `Card`, `TerminalCard`, `Chip`, `Glow`, and a `Section` tone.

**Pros**:
- Reuses everything already built and verified (fonts, reveals, reduced motion, no JavaScript fallback, the gate, the tests).
- Geist's step logic gives each token a clear job (surface, line, text, fill), so new sections pick by role, not by eye.
- Matches the look you pointed at, with your own accent values tuned for contrast.

**Cons**:
- Touches almost every primitive and test, and the scope plus `AGENTS.md` rules must be rewritten to match.
- Close to the reference's look, so Atticus needs its own details to stand apart.

### Revision option 2: adopt Geist wholesale

Switch to Geist Sans, Geist's own dark tokens, and Vercel style components.

**Pros**:
- One coherent, well documented system with a large following.

**Cons**:
- Geist's public pages give dark values only as `oklch` for a few steps and publish no violet scale, so the tokens would still be hand derived.
- Reads as a Vercel clone, and you chose to keep Satoshi.

### Revision option 3: copy the Cole James palette and type exactly

Use `#100F15`, their grays, Manrope, and their component values as measured.

**Pros**:
- Fastest path to the exact vibe in the screenshot.

**Cons**:
- A copy of another studio's brand.
- Their field border (`#464262`, about 2:1) and some muted text fail the contrast this project requires; they ship no focus styles and no reduced motion handling.

## Rationale

_The first version's reasoning follows. Where it covers amber, underline fields, field focus, and the letter roll on buttons, the revision at the end of this section replaces it._

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

**Revision (2026-10-13).** Revision option 1 wins because it changes only the layer that disappointed (color, surface, decoration, control shape) and keeps the layer that verified cleanly (motion, accessibility, the gate). Geist contributes structure rather than values: its 10 step roles (100 to 300 surfaces, 400 to 600 lines, 700 and 800 fills, 900 and 1000 text) and its radii (6px small, 12px medium, larger for cards). Cole James contributes the feel: violet obsidian, dot texture, glows, the light primary button, rounded cards, mono chips.

Your picks that shaped it: keep Satoshi; violet tinted obsidian; the light button with a violet arrow; rounded filled fields in the Cole James language; a page wide dot texture faded at the center; glows at the hero edges, section corners, and behind the primary button and cards; a soft black to obsidian fade; violet and blue as the accent (replacing amber), with soft violet `#A99BFF` for interaction; lavender grays for text; green status; red errors; 24px cards; the letter roll on text links only; glows that fade in once; faded hairline dividers; primary and secondary buttons; and `Card`, `Chip`, `TerminalCard`, and the texture plus glow layer as new primitives.

One of your picks departs from my first suggestion: violet and blue instead of amber. It is sound: one accent family across the glow and the controls makes the page feel whole. The cost is that amber's distinct identity is gone, and the focus ring now shares a hue with links (the outline shape carries it).

The decisions I made inside your choices, with the runner up for each:
- **Exact surface values** `#0E0D12`, `#15141B`, `#1C1B24`. A violet tint a touch darker than the reference's `#100F15`, so the void to base fade stays subtle. Runner up: your neutral `#0B0B0C` / `#121212`.
- **Field border `#6E6994`** (3.58:1 on its fill). The reference's `#464262` is about 2:1, below the 3:1 a field boundary needs. Runner up: `#66618A` (3.17:1), too close to the line.
- **Contrast as a matrix of pairs.** Text now sits on four surfaces, so each text token is tested on each. Runner up: test only on the lightest surface, simpler but hides a future dark on dark mistake.
- **Texture as background layers, not a fixed overlay.** Three layers per surface (center wash, dots, tone) keep the dots below content without stacking context fights, and cards hide them simply by being solid. Runner up: one fixed full page layer, which either covers section colors or sits under them.
- **Glows as gradients only, no `filter: blur`.** Large blurred elements are expensive to paint and composite; a `closest-side` radial gradient looks the same. Runner up: blurred shapes, closer to the reference's soft edges but slower on phones.
- **Hero glow visible at first paint (`reveal={false}`).** The first viewport must not wait for JavaScript. Runner up: fade the hero glow too, which would delay the hero's look until hydration.
- **Button arrow as an inline SVG.** The `↗` glyph renders differently per font and platform. Runner up: the glyph in Geist Mono.
- **Selection in violet with ink text** (8.13:1). It ties selection to the accent. Runner up: keep white with black.
- **Focus outline offset 3px following corner radius.** Modern browsers draw outlines along `border-radius`, so the ring matches pill and card shapes. Runner up: a `box-shadow` ring, which disappears in forced colors mode.
- **Field error keeps the violet focus ring.** Focus should look the same everywhere; the red border and `ERR //` message carry the error. Runner up: a red focus ring on errors, which makes focus inconsistent.
- **`Glow` fades through an IntersectionObserver and CSS, not Motion.** It needs only a one time opacity change, so a Motion component would add client JavaScript and an opacity conflict with the glow's strength. Runner up: an `m.div` like the reveals. (Raised by the cross check.)
- **Body text color named `copy`.** `text-body` is already the body font size in Tailwind's `text-` namespace, so a `body` color would make one class set both. Runner up: keep `body` and write `text-(color:--color-body)` everywhere.
- **Dot color `#262433`.** Text that lands on a dot pixel still passes 4.5:1 (`muted` at 4.52:1); the first pick `#2E2B3B` gave 4.09:1. Runner up: lighten `muted` instead, which would flatten the text hierarchy.
- **Hover halos as siblings behind the surface.** A negative z layer inside an isolated card paints over the card's own fill. Runner up: a `box-shadow` glow, which cannot fade as a soft radial.
- **At most two glows per viewport.** A usage rule, not a technical limit, to keep paint cost and visual noise down.

### Reference study: colejames.io (2026-10-13)

What was taken: large headings with tight negative tracking, uppercase mono labels with positive tracking, sparing 1px dividers, word by word heading reveals, the letter stagger on CTA hover (about 10ms per letter), and quick color transitions on links.

What the revision now also takes (2026-10-13, measured on the live page): the violet obsidian background (`#100F15`), lavender gray body text (`#B2AFCA`), the light primary button (`#D6D5E2` fill, dark text, violet arrow, 12px radius, layered drop shadow), the dark secondary button with a 1px violet gray border, rounded cards with a faint violet edge, mono chips on a tinted fill, the dot texture, edge and corner glows in violet into cyan blue, and hairlines that fade at both ends. The site has no form fields, so fields follow its button and card language.

Still left out, and why:
- GSAP, ScrollTrigger, Lenis, split-type, jQuery: spec 0001 fixes Motion and native scrolling.
- Manrope: you kept Satoshi.
- Their exact colors where they fail contrast (the `#464262` border as a field boundary).
- The floating pill nav and the giant footer wordmark: features 4 and 9 decide them.
- No reduced motion handling and no focus styles in the reference: gaps to avoid, not patterns to copy.

## References

**Project sources**:
- Spec 0001 (stack, CSP, static page, Motion as the motion system)
- Root `AGENTS.md` (rules, accessibility baseline, agent skills)
- `docs/.agent-cache/research/geist-design-system.md` (Geist research notes, 2026-10-13)
- The verified first build of this spec on `feat/design-system-motion`

**Practices & standards**:
- WCAG 2.x contrast: 4.5:1 for text (1.4.3), 3:1 for UI component boundaries and graphics (1.4.11)
- Geist color step roles and material radii
- Animate only `opacity` and `transform`; avoid large `filter` effects for paint cost
- Respect `prefers-reduced-motion`

**Links** (web verified 2026-10-13):
- Geist introduction: https://vercel.com/geist/introduction
- Geist colors: https://vercel.com/geist/colors
- Geist typography: https://vercel.com/geist/typography.md
- Geist materials: https://vercel.com/geist/materials.md
- Geist grid: https://vercel.com/geist/grid.md
- Cole James (visual reference): https://www.colejames.io/
