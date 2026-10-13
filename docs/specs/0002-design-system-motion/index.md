# 0002. Build the Atticus design system and motion foundation

**Date**: 2026-10-13 (revised 2026-10-13: violet obsidian surfaces, Geist structure, Cole James components)
**Status**: In Progress

## Summary

This spec sets the visual language every section of the Atticus page is built from. The revision moves the site from pure black and amber to a violet obsidian look: a pure black void for the hero that fades into a faintly violet near black (`#0E0D12`) for every other section, raised obsidian cards (`#15141B`), a fine dot texture across the page, and soft violet, blue, and cyan glows. It borrows Vercel Geist's structure (a step scale per color, small and large corner radii) and Cole James's components (light lavender primary button with a violet arrow, rounded fields, rounded cards, mono chips). Satoshi and Geist Mono stay as the typefaces, and the motion system (scroll reveals, letter roll on links, reduced motion, no JavaScript fallback) stays as built. Every text color passes WCAG AA on every surface it can sit on, and a test enforces it.

## Requirements

**User stories**:
- As a visitor, I want the page to feel calm, premium, and fast, with depth instead of flat black, so that I trust Atticus with serious engineering work.
- As a visitor who prefers reduced motion, uses a keyboard, or uses a screen reader, I want the same content and controls without movement or barriers, so that the site works for me too.
- As the developer building each section, I want tokens, surfaces, primitives, and one motion pattern ready to use, so that every section looks consistent and I never invent a value.

**Acceptance criteria**:
- **AC-1**: All colors are defined once as tokens in `src/app/globals.css` with the exact values in *Feature design*, and Tailwind's default palette is removed (`--color-*: initial`). The *Contrast pairs* table in *Feature design* is the single authority on which pairs are tested and their thresholds. A Vitest test parses the tokens from `globals.css`, checks every pair in that table, and fails naming the token and surface of any pair below its threshold. The same test asserts the theme also resets `--radius-*` and `--shadow-*` to `initial`.
- **AC-2**: Satoshi (one self hosted variable woff2: weight 400 for body, 500 for headings) and Geist Mono (from the pinned `geist` package; used for labels, chips, terminal text) load through `next/font` with no network fetch at build time. The live page makes no font request to any third party origin, the CSP stays unchanged, and the cumulative layout shift (CLS) measured on `/styleguide` stays below 0.01.
- **AC-3**: The fluid type scale (display 40 to 96px, h1 32 to 64px, h2 24 to 40px, h3 20 to 28px, body 16 to 18px, label 12 to 13px), the spacing tokens (container 1280px outer width including gutters, gutters 24 to 48px, section padding 96 to 192px, anchor scroll margin, void fade 200px), the radius tokens (`chip` 6px, `control` 12px, `card` 24px, `full` for dots; Tailwind's default radius and shadow scales removed), and the shadow token `control` exist as Tailwind theme tokens. At 320px viewport width nothing scrolls horizontally, including a display size heading containing the word "Infrastructure" (headings wrap long words), and including every glow (checked on both `document.documentElement` and `document.body`, against `window.innerWidth`).
- **AC-4**: Content wrapped in `Reveal` (or `RevealItem` inside a `RevealGroup`) fades in while rising 16px over 600ms with the shared ease out curve, the first time any part of it is at least 10% of the viewport height inside the bottom edge. It never replays on scroll back. `RevealGroup` staggers its items by 60ms. `RevealWords` reveals a heading word by word, 40ms apart, each word rising `0.3em` over 600ms. Reveals animate only `opacity` and `transform`, so they cause zero layout shift.
- **AC-5**: When the visitor's system requests reduced motion: reveals and glow fades become a 150ms opacity fade with no movement and no stagger (`RevealWords` fades the whole heading as one block). The letter roll is off. The status halo is hidden, leaving a static dot. `Button` hover lift, press scale, and arrow nudge are off. Card hover glow appears without a transition. Smooth anchor scrolling is off (already in place from spec 0001).
- **AC-6**: With JavaScript disabled, every `Reveal`, `RevealItem`, `RevealWords` child, and every `Glow` is fully visible and in its final position. The `noscript` rule targets `[data-reveal]` only; hover glows carry no `data-reveal` and need none.
- **AC-7**: `ActionLink` (`next/link` for internal targets, a plain anchor with `target="_blank" rel="noopener noreferrer"` when `external`) renders `violet` text that turns `violet-hover` on hover. On devices with a hover capable pointer, hover and keyboard focus run a letter roll: each letter slides up out of its clip box while a copy rises from below, 10ms apart, 250ms each. It holds while hovered or focused and reverses on leave. Screen readers announce the label once, as normal text, and the optional trailing `→` is hidden from them. Keyboard focus on any link or button shows a 2px `violet` outline with a 3px offset that follows the element's corner radius, only on `:focus-visible`, never on mouse click.
- **AC-8**: `Button` (Base UI) has two variants. `primary`: `button` fill, `ink` text, 1px `border` edge, `control` radius and shadow, with an optional `↗` arrow icon in `violet-deep`. `secondary`: `raised` fill (`overlay` on hover), `heading` text, 1px `field-line` border, same radius and shadow. Both are at least 48px tall (`min-h-12 px-6`, label to arrow `gap-2`, `text-body` at weight 500). Neither uses the letter roll. A disabled (not pending) button shows `muted` text on `raised` with a `field-line` border, `cursor-not-allowed`, no opacity change, and no hover or press motion. On hover capable pointers, hover lifts the button 1px and nudges the arrow 2px up and right; press scales it to 0.97; the primary fill turns `button-hover` on hover; a soft violet glow appears behind the primary button on hover. Screen readers announce the label once and never the arrow. A `Button` in its pending state shows the caller's `pendingLabel` (falling back to the label), keeps its colors and shadow at full opacity, drops the hover and press motion and the hover glow, stays focusable, announces itself as disabled, and ignores both click and Enter (no double submit).
- **AC-9**: `TextField` (Base UI Field; a single line input or, with `multiline`, a textarea) shows a visible label above the control in the mono label style, in `muted`, tied to the control. There is never placeholder text. The control has a `raised` fill, `control` radius, a 1px `field-line` border at rest (unchanged on hover), `heading` text at `text-body` size, and a `violet` caret. A single line control is `min-h-12 px-4`; the `multiline` textarea is `min-h-32 px-4 py-3 resize-y`. A disabled field shows `muted` text and `cursor-not-allowed`, no opacity change. On focus the border turns `violet` and a 2px `violet` outline with a 2px offset appears. In the error state the border is `red` at rest (focus still shows the violet ring), `aria-invalid="true"` is set, and a `red` message prefixed `ERR //` in mono appears below, linked through `aria-describedby`. Browser autofill keeps the `raised` fill and `heading` text. It works fully by keyboard.
- **AC-10**: `StatusIndicator` renders an 8px `green` dot (decorative, hidden from assistive tech) next to its text label in the `mono-label` style, `muted`. A green halo behind the dot grows and fades every 2.4s. The meaning always lives in the text, never in the color alone. `SectionLabel` renders `NN // LABEL` (index zero padded to two digits, label uppercased in CSS) in the `mono-label` style (Geist Mono, `text-label`, uppercase, wide tracking), `muted`. Given `index={1}` and `Services`, it reads `01 // SERVICES`.
- **AC-11**: Surfaces. The page background is `base`. `Section` takes `tone="void" | "base"` (default `base`). A `void` section paints `void` and fades into `base` over its last 200px, with no hard edge. Both tones carry the dot texture: 2px soft edged dots in `dot` on a 24px grid, faded out toward the center of each section (not the viewport) by a wide radial wash of the section's own tone, so most text sits on few or no dots. Text that does land on a dot still passes contrast (the `dot` rows in *Contrast pairs*). Cards and fields cover the texture with their solid fill. The dot grid may shift phase at the seam between sections (accepted). The texture is pure CSS, scrolls with the page, and causes no layout shift. In forced colors mode the texture and glows are hidden, and `Card`, `Button`, and `TextField` show a 1px solid `CanvasText` border.
- **AC-12**: `Glow` renders a soft radial light (no CSS `filter`, gradients only, its 45% strength baked into the gradient colors) behind a section's content, never above text. It takes a `hue` (`violet`, `blue`, `cyan`, or `violet-blue`), a `position` (`top`, `bottom`, the four corners, or `center`), and a `size` (`sm`, `md`, `lg`). It is decorative (`aria-hidden`, no pointer events). By default it fades in once (opacity 0 to 1 over 1200ms) when it enters the viewport and then stays still, driven by an IntersectionObserver and a CSS transition, not Motion; with `reveal={false}` (for the hero, which is in the first viewport) it is visible from the first paint. It never loops. Its size scales down on narrow viewports so it never causes horizontal scroll.
- **AC-13**: `Card` renders a `raised` surface with a 1px `border` edge and `card` radius, padding from the spacing scale, and no shadow. With `glow`, a soft violet halo (`glow-violet` at 30%, extending 24px past the card edge) fades in behind the card over 600ms on hover (hover capable pointers only) and on `:focus-within`. The halo is a sibling layer behind the card surface, so it never tints the fill or covers text, including a neighboring card's. `TerminalCard` is a `Card` with a window bar (three decorative `overlay` dots and a mono `title`) above a mono body in `copy` color. `Chip` renders Geist Mono at `text-label` size, not uppercased, in `copy` on an `overlay` fill with `chip` radius. `Divider` renders a 1px `hairline` that fades to transparent at both ends, hidden from assistive tech.
- **AC-14**: `/styleguide` shows every color token as a swatch with its contrast ratio on `base`, both surface tones with the texture, every glow hue, every type step, the spacing and radius tokens, and every primitive (hover and focus live; error and pending set through props). It is prerendered (exports `ensureStatic`), carries `noindex`, passes an axe scan with zero violations, and returns HTTP 404 in a build made with `VERCEL_ENV=production`, which CI checks on every run.
- **AC-15**: `docs/design.md` documents the tokens with their Geist style roles, the contrast pairs, type, spacing, radius, surfaces and texture, glows (where they may go and where not), the motion rules (durations, easing, reduced motion, the no JavaScript fallback, where reveals may and may not be used), usage rules (violet only on interactive elements and focus, green only for status, red only for errors), the primitive inventory with props, and the pinned versions of `motion`, `@base-ui/react`, and `geist`.
- **AC-16**: Text selection is a `violet` background with `ink` text. The home page still passes the `ensureStatic` build guard, and no page logs a CSP violation.

## Decision

**Chosen option**: Option 1: retoken the built system in place, adopt Geist's color step structure and radii, and add the Cole James surface and component layer.

Keep the Tailwind theme tokens, the hand built primitives, Base UI for fields and buttons, and Motion for reveals. Replace the palette with a violet obsidian token set, add radius, shadow, surface, texture, and glow tokens, restyle `Button`, `TextField`, `StatusIndicator`, `SectionLabel`, and `Divider`, and add `Card`, `TerminalCard`, `Chip`, and `Glow` plus a `tone` on `Section`.

**Implementation skills**: `tailwind-4-docs` (`lombiq/tailwind-agent-skills`, `.claude/skills/tailwind-4-docs/`) · `tailwind-design-system` (`wshobson/agents`, `.claude/skills/tailwind-design-system/`) · `web-styling-cva` (`agents-inc/skills`, `.claude/skills/web-styling-cva/`) · `base-ui-react` (`secondsky/claude-skills`, `.claude/skills/base-ui-react/`) · `mui-base` (`pproenca/dot-skills`, `.claude/skills/mui-base/`) · `framer-motion-animator` (`patricio0312rev/skills`, `.claude/skills/framer-motion-animator/`) · `animate` (`emilkowalski/skills`, `.claude/skills/animate/`) · `emil-design-eng` (`emilkowalski/skills`, `.claude/skills/emil-design-eng/`) · `apple-design` (`emilkowalski/skills`, `.claude/skills/apple-design/`) · `vitest` (`antfu/skills`, `.claude/skills/vitest/`) · `playwright-best-practices` (`currents-dev/playwright-best-practices-skill`, `.claude/skills/playwright-best-practices/`)

> Heads up for the build: both Base UI skills import from the deprecated `@base-ui-components/react`. Keep importing from **`@base-ui/react`** (1.9.0, already installed).

## Rationale

Reasoning and options: see [rationale.md](rationale.md).

## Feature design

**Data model sketch**: no persisted data. The model of this feature is the token set below. Colors, type, spacing, radius, shadow, easing, durations, and keyframes live only in `src/app/globals.css`. Motion needs numbers in JavaScript, so `src/lib/motion.ts` holds the motion values, and a test asserts the CSS custom properties match it. That is the one deliberate mirror.

*Color tokens* (`@theme`, which starts with `--color-*: initial;`). Roles follow Geist's step logic: surfaces, then lines, then text, then solid fills. All values are hex so `parseColorTokens` can read them.

| Token | Value | Geist role | Use |
|---|---|---|---|
| `--color-void` | `#000000` | background | hero void only (`Section tone="void"`) |
| `--color-base` | `#0E0D12` | background | page and every non hero section |
| `--color-raised` | `#15141B` | 100 | cards, terminal cards, field fill, secondary button fill |
| `--color-overlay` | `#1C1B24` | 200 | chips, terminal window dots, hover fill inside cards |
| `--color-hairline` | `#24222E` | 300 | `Divider` line (decorative) |
| `--color-border` | `#2A2836` | 400 | card edge, primary button edge (decorative) |
| `--color-dot` | `#262433` | 300 | dot texture (decorative, also tested as a backdrop for text) |
| `--color-field-line` | `#6E6994` | 600 | field border, secondary button border (UI boundary) |
| `--color-muted` | `#8C89A6` | 900 | labels, meta lines, field labels, status text |
| `--color-copy` | `#B2AFCA` | 900 | body copy, chip and terminal text (named `copy`, not `body`, because `text-body` is already the body font size) |
| `--color-heading` | `#F6F6F9` | 1000 | headings, input text, emphasized text |
| `--color-violet` | `#A99BFF` | accent 900 | links, focus ring, caret, field focus border |
| `--color-violet-hover` | `#C4BAFF` | accent 1000 | link hover |
| `--color-violet-deep` | `#5B4BDB` | accent 700 | arrow icon on the light primary button only |
| `--color-button` | `#D6D5E2` | gray 1000 fill | primary button fill |
| `--color-button-hover` | `#E6E5EF` | gray 1000 hover | primary button hover fill |
| `--color-ink` | `#0E0D12` | text on light | primary button text, selection text |
| `--color-green` | `#4ADE80` | green 900 | status dot and halo only |
| `--color-red` | `#FF6B6B` | red 900 | field error border and message only |
| `--color-glow-violet` | `#6E44FF` | decorative | glows |
| `--color-glow-blue` | `#3D6BFF` | decorative | glows |
| `--color-glow-cyan` | `#38B2F8` | decorative | glows |

No other color may appear. Never use opacity to dim text; use `muted`. Glow colors are used only inside `Glow` and the hover glows, always as gradients fading to transparent. The theme also sets `--radius-*: initial` and `--shadow-*: initial` before defining its own, so Tailwind's default `rounded-*` and `shadow-*` scales do not exist.

*Contrast pairs* (the test's constant map; ratios measured 2026-10-13):

| Foreground | On | Needs | Lowest measured |
|---|---|---|---|
| `heading`, `copy`, `muted`, `violet`, `violet-hover`, `red` | `void`, `base`, `raised`, `overlay` | 4.5 | `muted` on `overlay` 5.07 |
| `heading`, `copy`, `muted`, `violet`, `red` | `dot` | 4.5 | `muted` on `dot` 4.52 |
| `green` | `void`, `base`, `raised`, `overlay` | 3 (graphic) | 9.78 |
| `ink` | `button`, `button-hover` | 4.5 | 13.34 |
| `violet-deep` | `button` | 3 (graphic) | 4.17 |
| `field-line` | `base`, `raised` | 3 (UI boundary) | 3.58 on `raised` |
| `violet` (focus ring) | `void`, `base`, `raised` | 3 | 7.68 |
| `ink` on `violet` (selection) | `violet` | 4.5 | 8.13 |

`void`, `base`, `raised`, `overlay`, `hairline`, `border`, `dot`, `button`, `button-hover`, and the glow tokens are not tested as foregrounds (surfaces or decoration).

*Type tokens* (unchanged; `@theme`; fluid between a 375px and a 1440px viewport):

| Token | Size | Line height | Tracking | Weight | Face |
|---|---|---|---|---|---|
| `--text-display` | `clamp(2.5rem, 1.27rem + 5.26vw, 6rem)` | 1 | -0.035em | 500 | sans |
| `--text-h1` | `clamp(2rem, 1.3rem + 3vw, 4rem)` | 1.05 | -0.03em | 500 | sans |
| `--text-h2` | `clamp(1.5rem, 1.15rem + 1.5vw, 2.5rem)` | 1.15 | -0.02em | 500 | sans |
| `--text-h3` | `clamp(1.25rem, 1.07rem + 0.75vw, 1.75rem)` | 1.25 | -0.01em | 500 | sans |
| `--text-body-lg` | `clamp(1.125rem, 1.08rem + 0.19vw, 1.25rem)` | 1.6 | 0 | 400 | sans |
| `--text-body` | `clamp(1rem, 0.96rem + 0.19vw, 1.125rem)` | 1.6 | 0 | 400 | sans |
| `--text-small` | `0.875rem` | 1.5 | 0 | 400 | sans |
| `--text-label` | `clamp(0.75rem, 0.73rem + 0.09vw, 0.8125rem)` | 1.4 | 0.08em | 400 | mono, uppercase |

Fonts stay wired with `@theme inline` (`--font-sans` Satoshi, `--font-mono` Geist Mono with `tnum`). Body default becomes `font-sans text-body text-copy` on `bg-base`. An `@utility mono-label` bundles `font-mono`, `text-label`, and `uppercase` for every label (section labels, field labels, status text, terminal titles). Headings get `overflow-wrap: break-word; hyphens: auto`.

*Spacing, radius, and shadow tokens*: Tailwind's default `--spacing: 0.25rem` scale stays, plus:
- `--container-content: 80rem`, `--container-prose: 40rem`, `--spacing-gutter`, `--spacing-section`, `--spacing-anchor: 6rem` (unchanged).
- `--spacing-fade: 12.5rem`: the 200px void to base fade.
- `--spacing-dot: 1.5rem`: the 24px dot grid pitch.
- `--radius-*: initial`, then `--radius-chip: 6px` (Geist small material), `--radius-control: 12px` (Geist medium: buttons, fields), `--radius-card: 24px` (cards; inner controls at 12px nest inside 12px of padding or more), `--radius-full: 9999px` (dots).
- `--shadow-*: initial`, then `--shadow-control: 0 1px 2px rgb(0 0 0 / 0.75), 0 3px 3px rgb(0 0 0 / 0.5), 0 7px 4px rgb(0 0 0 / 0.25)`, plus for the primary button only an inner top highlight `inset 0 1px 0 rgb(255 255 255 / 0.5)` written in the `Button` variant.

*Texture*: an `@utility texture-dots` that sets three background layers, top first: `radial-gradient(ellipse 100% 70% at 50% 50%, var(--tone, var(--color-base)) 30%, transparent 100%)` (the center wash, centered on the section box), `radial-gradient(circle, var(--color-dot) 1px, transparent 1.5px) 0 0 / var(--spacing-dot) var(--spacing-dot)` (2px soft dots), and `var(--tone, var(--color-base))` (the solid tone). The fallback means `body` and any `base` section need no `--tone`; `Section` sets `data-tone="void"` and a base layer rule `[data-tone="void"] { --tone: var(--color-void) }` switches it. `body` and every `Section` use the utility.

*Void fade*: a `void` section adds a `::after` layer at `bottom: 0`, full width, `height: var(--spacing-fade)`, `background: linear-gradient(to bottom, transparent, var(--color-base))`, `pointer-events: none`. Paint order inside the section, bottom to top: the texture background, the fade, the `decor` glows, the `relative z-10` content wrapper. Its bottom row is exactly `base`.

*Forced colors*: `@media (forced-colors: active)` hides `Glow`, hover glows, and the texture layers (`background: Canvas`), and gives `Card`, `Button`, and the `TextField` control `border: 1px solid CanvasText`. Focus stays an outline, which forced colors already honors.

*Glow geometry*: each glow is an absolutely positioned square box whose background is `radial-gradient(closest-side, color-mix(in srgb, <hue> 45%, transparent), transparent)`. The 45% lives in the gradient, so the element's own opacity is free to go from 0 to 1. `violet-blue` stacks two gradients in the same box, each sized 70% of it: violet centered at 35% 40%, blue at 65% 60%. Sizes: `sm` `min(24rem, 70vw)`, `md` `min(40rem, 90vw)`, `lg` `min(64rem, 120vw)`; the section clips it (`overflow: clip`), which is why `lg` may exceed the viewport without scrolling. Positions place the box center on that edge or corner, half outside the section, using the CSS `translate` property (never `transform`, so a future animation cannot overwrite it).

*Glow reveal*: `Glow` is a small client component. With `reveal` (default) it renders `data-reveal` and starts at `opacity: 0`; one `IntersectionObserver` per glow (same 10% bottom margin as reveals, disconnected after the first hit) sets `data-in`, and CSS transitions opacity to 1 over `--duration-glow` with `--ease-out-strong` (`--duration-fast` under reduced motion). With `reveal={false}` it renders as a plain visible element and needs no JavaScript. The `noscript` rule makes revealing glows visible without JavaScript.

*Hover glows*: `Card glow` renders a wrapper `div` (`relative`), an `aria-hidden` halo sibling first (`absolute -inset-6`, `radial-gradient(closest-side, color-mix(in srgb, var(--color-glow-violet) 30%, transparent), transparent)`, opacity 0, transitioned over 600ms with `--ease-out-strong`), then the card surface (`relative`). The wrapper's `:hover` (inside `@media (hover: hover)`) and `:focus-within` set the halo to opacity 1. `Button` primary does the same with a wrapper `span` (`relative inline-flex`) and a halo at `-inset-4`. Halos sit in the section's stacking context below the surface they belong to, never above any text.

*Motion tokens*. `src/lib/motion.ts` stores durations and staggers in milliseconds with a `toSeconds(ms)` helper. The CSS mirror lives in `globals.css` (`--ease-*` inside `@theme`, durations as `:root` custom properties). The mirror test checks each CSS value equals `${ms}ms` and the easing strings match.

| `motion.ts` name | CSS mirror | Value | Used by |
|---|---|---|---|
| `ease.out` | `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | reveals, letter roll, button, field, card glow |
| `duration.fast` | `--duration-fast` | 150 | color changes, reduced motion fade, button lift and press, field focus |
| `duration.roll` | `--duration-roll` | 250 | each letter in the link hover roll |
| `duration.reveal` | `--duration-reveal` | 600 | `Reveal`, `RevealItem`, `RevealWords`; card and button hover halos |
| `duration.glow` | `--duration-glow` | 1200 | `Glow` fade in (CSS transition) |
| `duration.pulse` | `--duration-pulse` | 2400 | status halo loop |
| `stagger.letters` | `--stagger-letters` | 10 | letter roll delay per letter |
| `stagger.words` | none | 40 | `RevealWords` |
| `stagger.children` | none | 60 | `RevealGroup` |
| `reveal.distance` | none | 16 (px) | block rise |
| `reveal.wordDistance` | none | `"0.3em"` | word rise |
| `reveal.viewport` | none | `{ once: true, amount: "some", margin: "0px 0px -10% 0px" }` | all reveals; `Glow` passes the same margin as its `rootMargin` |

*Global base styles*: `::selection { background: violet; color: ink }`; `:focus-visible { outline: 2px solid var(--color-violet); outline-offset: 3px }` with no `border-radius` reset, so the outline follows each element's corners; `TextField` overrides the offset to 2px. `html` keeps `color-scheme: dark` and the smooth scroll rules. The autofill rule paints `raised` with an inset shadow and keeps `heading` text and a `violet` caret.

**State transitions**: each reveal element moves `hidden → visible` exactly once per page load (Motion `whileInView` with `viewport.once: true`), and each revealing `Glow` does the same through `data-in` (observer disconnected after the first hit). The link letter roll is a CSS state, `rest ↔ rolled`, on `:hover` and `:focus-visible`. `Button` is `rest ↔ hover ↔ pressed`, and `pending` freezes it at rest. `Card` with `glow` is `rest ↔ lit` on `:hover` and `:focus-within`.

**API surface** (component props; all under `src/components/ui/`, named exports, one file each plus a colocated `*.test.tsx`):

| Primitive | Kind | Key props | Renders | Change |
|---|---|---|---|---|
| `Container` | server | `children`, `className?` | `div`, `max-w-content`, `px-gutter`, `mx-auto` | none |
| `Section` | server | `id: string` (req), `labelledBy?`, `tone?: "base" \| "void"` (default `base`), `decor?: ReactNode`, `children` | `section` with `id`, `relative overflow-clip`, `py-section`, `scroll-mt-anchor`, `texture-dots`; `decor` (glows) rendered first, children in a `relative z-10` wrapper; `void` adds the bottom fade | adds `tone`, `decor` |
| `Heading` | server | `level`, `size?`, `id?` | `h1`/`h2`/`h3` in `heading` | recolor |
| `Text` | server | `size?`, `tone?: "body" \| "muted" \| "strong"`, `as?` | `text-copy` / `text-muted` / `text-heading` | recolor |
| `SectionLabel` | server | `index` (req), `children: string` (req) | `p` with `mono-label`, `muted` | recolor |
| `Divider` | server | `className?` | `hr` `aria-hidden`, 1px, `linear-gradient(to right, transparent, hairline, transparent)` | fade ends |
| `SplitLetters` | shared | `children: string` | unchanged | used by `ActionLink` only |
| `ActionLink` | server | `href` (req), `children: string` (req), `arrow?`, `external?` | unchanged markup, `violet` text, `violet-hover` on hover | recolor |
| `Button` | client | `children: string` (req), `variant?: "primary" \| "secondary"` (default `primary`), `pendingLabel?`, `pending?`, `arrow?`, `type?` (default `"button"`), rest of `Omit<BaseButtonProps, "children">` | a `span` wrapper (`relative inline-flex`, the hover group) holding the primary hover halo (`aria-hidden`) and the Base UI `Button`; label as plain text (no `SplitLetters`), arrow as an inline `ArrowUpRight` SVG in an `aria-hidden` span | variants, no roll |
| `TextField` | client | unchanged | Base UI `Field` parts, label with `mono-label`, rounded filled control | restyle, red errors |
| `StatusIndicator` | server | `children: string` (req) | 8px `green` dot (`aria-hidden`) with `::after` halo, text in `muted` | recolor |
| `Card` | server | `children`, `as?: "div" \| "article" \| "li"` (default `div`), `glow?: boolean`, `className?` | `raised` fill, 1px `border`, `card` radius, `p-6 sm:p-8`, `relative`; with `glow`, wrapped as described under *Hover glows* | new |
| `TerminalCard` | server | `title: string` (req), `children` | `Card` with a bar: three 8px `overlay` dots (`aria-hidden`) and the title in `mono-label` `muted`; body `font-mono text-small text-copy`, `whitespace-pre-wrap` | new |
| `Chip` | server | `children: string` (req) | `span`, `font-mono text-label` (not uppercase), `text-copy` on `bg-overlay`, `chip` radius, `px-2 py-1` | new |
| `Glow` | client | `hue: "violet" \| "blue" \| "cyan" \| "violet-blue"` (req), `position: "top" \| "bottom" \| "top-left" \| "top-right" \| "bottom-left" \| "bottom-right" \| "center"` (req), `size?: "sm" \| "md" \| "lg"` (default `md`), `reveal?: boolean` (default `true`) | `div`, `aria-hidden`, `pointer-events-none absolute`, with `data-reveal` and the observer when revealing (see *Glow reveal*); no Motion | new |
| `MotionProvider`, `Reveal`, `RevealGroup`, `RevealItem`, `RevealWords` | client | unchanged | unchanged | none |
| `ArrowUpRight` | server | `className?` | 16px inline SVG, `currentColor` stroke, `aria-hidden`, `focusable="false"` | new, internal to `Button` |

Route: `src/app/styleguide/page.tsx`, unchanged gate (`isStyleguideEnabled(env.VERCEL_ENV)`, `ensureStatic`, `noindex`). It gains a void section with a top glow at the top of the page, a surfaces section, a glow section, a radius row, and specimens of `Card`, `Card glow`, `TerminalCard`, `Chip`, both `Button` variants, and `Divider`. Swatches are the one place filled color blocks of any token are allowed.

Layout: `src/app/layout.tsx` keeps the font variables, `MotionProvider`, and the `noscript` style (`[data-reveal]{opacity:1!important;transform:none!important}`, which also covers revealing glows through their `data-reveal`). `body` gets `bg-base texture-dots`.

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Any primitive | color, size, spacing, radius, shadow values | tokens in `src/app/globals.css`, values fixed by this spec |
| Contrast test and `/styleguide` swatches | each color token's hex value | `parseColorTokens(css)` in `src/lib/design/tokens.ts`, first `@theme` block |
| Contrast test | which pairs are tested and their thresholds | the *Contrast pairs* table, as a constant list of `{ fg, bg, min }` in the test |
| `/styleguide` swatch ratio | ratio shown per swatch | `contrastRatio(value, base)` (was black); surfaces show their ratio against `heading` instead |
| Contrast ratio | formula | WCAG 2.x relative luminance, `contrastRatio(a, b)` in `src/lib/design/contrast.ts` |
| Reveals | duration, easing, distance, stagger, viewport | `src/lib/motion.ts` |
| `Glow` fade | duration, easing, trigger margin | `--duration-glow`, `--ease-out-strong` (mirrored from `motion.ts`), `reveal.viewport.margin` as `rootMargin` |
| Glow strength | 45% (glows), 30% (hover halos) | fixed by this spec, inside `color-mix` |
| Link letter roll, halo, button and field transitions, card glow | duration, easing, letter delay | CSS custom properties mirrored from `src/lib/motion.ts` |
| Section surface | which tone, so which `--tone` | `Section`'s `tone` prop, rendered as `data-tone`; default `base` (the `var()` fallback); feature 4 passes `void` for the hero |
| Void fade | fade length | `--spacing-fade` |
| Dot texture | dot color, size, pitch, center wash size | `--color-dot`, the 1px to 1.5px stops, `--spacing-dot`, the `ellipse 100% 70%` in `texture-dots` |
| Button and field sizes | heights, padding, gap, textarea rows | fixed by this spec in AC-8 and AC-9 |
| `Glow` | hue, position, size, whether it reveals | `Glow` props from the section that places it |
| `Card` glow | whether it glows | `Card`'s `glow` prop |
| `TerminalCard` | title and body text | `title` prop and `children` from the caller (feature 7) |
| `Button` | variant, arrow, pending, label | `variant`, `arrow`, `pending`, `pendingLabel` props (feature 5 passes `useActionState`'s pending state) |
| `TextField` error message | message text | `error` prop from the caller (feature 5) |
| `SectionLabel` | `01 // SERVICES` | `index` zero padded, label from `children` uppercased in CSS |
| Reduced motion (JS) | whether to animate | Motion `useReducedMotion()`, used only to choose transitions, never markup |
| Reduced motion (CSS) | same | `@media (prefers-reduced-motion: reduce)`; hover effects also gated on `@media (hover: hover)` |
| No JavaScript fallback | final visible state | `<noscript>` style on `[data-reveal]` |
| `/styleguide` 404 gate | production build or not | `env.VERCEL_ENV` at build time |
| Satoshi, Geist Mono | font files | unchanged: committed Satoshi woff2 and licence, `geist` package |
| Library versions | exact versions | unchanged pins, recorded in `docs/design.md` |

**Key invariants**:
- `violet` appears only on links, the focus ring, the caret, the field focus border, selection, and the primary button arrow (`violet-deep`). `glow-*` only in `Glow` and hover halos. `green` only on the status dot and halo. `red` only on field errors. Never on body text, headings, or labels.
- Surfaces are `void` (hero only), `base`, `raised`, `overlay`. No other background colors. Gradients are allowed only in `texture-dots`, the void fade, `Glow`, hover glows, and `Divider`. Shadows only on buttons (`shadow-control`) and the autofill inset.
- Glows are always behind content (the `decor` slot or a halo sibling placed before its surface), never over text, never animate after their one fade, and never use CSS `filter`. `Reveal` never wraps an ancestor of a `Glow` (an animating ancestor would repaint the large gradient every frame). At most two glows per viewport.
- Keep at least 5px between any focusable control and a `Section` edge, so `overflow: clip` never cuts a focus ring (the gutter already gives 24px or more).
- Corner radii come only from `chip`, `control`, `card`, or full round (dots).
- Reveals and glow fades animate only `opacity` and `transform`. Nothing in the first viewport on load reveals (the hero uses `Glow reveal={false}`; feature 4 owns its entrance). Never wrap a whole section in `Reveal`.
- Every element Motion hides initially carries `data-reveal`.
- The reduced motion choice changes only transitions, never markup.
- Split text always pairs an `sr-only` full string with an `aria-hidden` visual copy. Icons inside controls are `aria-hidden`.
- Motion is imported only through `m` inside `LazyMotion`. Primitives without motion stay server components.
- The home page and `/styleguide` export `ensureStatic`. No request APIs.
- No new third party origin, no build time network for fonts, CSP unchanged.
- Each token value exists once in `globals.css` (the `ink` and `base` hex match on purpose, as different roles). The only mirror is `motion.ts`.

**Security model**: public, static, no user data. `/styleguide` is `noindex`, 404 in production builds, checked in CI. `TextField` renders error strings only as React text. External links use `rel="noopener noreferrer"`.

**Configuration required**: none new. No new dependencies.

**Critical test scenarios**:
- Contrast matrix: the test passes on the real `globals.css`; a fixture with `--color-muted: #66637A` (3.35:1 on `base`) fails naming `muted` and each surface it misses. Verifies **AC-1**.
- Reveal once: on `/styleguide`, blocks fade and rise once, words stagger, scrolling back does not replay, a block taller than the viewport still reveals. Verifies **AC-4**, **AC-14**.
- Glow: a revealing `Glow` gets `data-in` and goes from opacity 0 to 1 over about 1200ms when scrolled into view, then has no running animations (`getAnimations()` empty); the void section's top glow has opacity 1 at first paint; a `violet-blue` glow renders two gradients. Verifies **AC-12**.
- Hover halo: hovering a `Card glow` raises its halo to opacity 1; the card's own fill color is unchanged and the halo's bounding box sits behind the card (`elementFromPoint` at the card center returns the card or its content). Verifies **AC-13**.
- Forced colors: with `forcedColors: "active"`, glows are hidden and `Card`, `Button`, and the field show a solid border. Verifies **AC-11**.
- Reduced motion: with `reducedMotion: "reduce"`, reveal targets and glows reach full opacity with `transform: none` within 300ms, heading words share one fade, link letters do not move, the button does not lift or scale, and the status halo is hidden. Verifies **AC-5**, **AC-10**.
- No JavaScript: every `[data-reveal]` element, glows included, computes `opacity: 1`. Verifies **AC-6**.
- Keyboard: tabbing to links and buttons shows a 2px violet outline with 3px offset; tabbing to a field shows a violet border and 2px violet outline with 2px offset. A mouse click shows no outline. Verifies **AC-7**, **AC-8**, **AC-9**.
- Button: primary computes `button` fill, `ink` text, 12px radius, the shadow; secondary computes `raised` fill and `field-line` border; the arrow is not in the accessibility tree; hovering moves the button up 1px; pending keeps focus, has `aria-disabled="true"`, and neither click nor Enter fires `onClick` or submits its form. Verifies **AC-8**.
- Field error: `aria-invalid="true"`, an accessible description containing `Enter a valid email`, a `red` border, and `ERR //` visible. Verifies **AC-9**.
- Surfaces: `body` computes `base`; a `void` section's top left pixel is `#000000` and its bottom pixel row equals `#0E0D12` within 1 per channel; the dot texture is present on both tones and absent inside a `Card`. Verifies **AC-11**, **AC-13**.
- Layout: at 320px, both `document.documentElement.scrollWidth` and `document.body.scrollWidth` are at most `window.innerWidth` on `/styleguide` with every glow size rendered. Verifies **AC-3**, **AC-12**.
- Fonts, CLS, CSP: no console or CSP errors, same origin fonts, summed layout shift below 0.01. Verifies **AC-2**, **AC-16**.
- Accessibility: axe on `/styleguide` reports zero violations. Verifies **AC-14**.
- Production gate: unchanged script asserts 404. Verifies **AC-14**.

## Build plan

Ordered as a Tracer Bullet: the motion system and fonts are already built and stay. First a thin thread that proves the new look end to end on a real preview (tokens, surface, texture, one glow, one card, the primary button), then thicken it one layer at a time. Each milestone keeps `pnpm test`, `pnpm test:e2e`, and the build green.

**Milestone 1: thin thread of the new look, live on a preview**
1. Replace the color tokens in `globals.css` with the new set and update the contrast test to the *Contrast pairs* matrix (and its fixture). Rename every old color class across `src/` (`bg-black` → `bg-base`, `text-white` → `text-heading`, `text-gray` → `text-copy` or `text-muted` per the table, `text-amber` → `text-violet`, `surface` → `raised`, `hairline` stays). Update `::selection`, `:focus-visible`, and autofill. Satisfies **AC-1**, **AC-7** (focus), **AC-16**.
2. Add `--spacing-fade`, `--spacing-dot`, the radius and shadow tokens (with the default scales reset), the `mono-label` and `texture-dots` utilities, the void fade, and the forced colors rules. Give `body` `bg-base texture-dots`. Add `tone` (as `data-tone`) and `decor` to `Section`. Satisfies **AC-3**, **AC-11**.
3. Add `duration.glow` and the `--duration-reveal` mirror to `motion.ts` and `globals.css`, and build `Glow` (observer plus CSS, no Motion). Build `Card`. Restyle `Button` primary (no roll, arrow SVG, lift and press, hover glow). Put a void section with a top `Glow reveal={false}`, one `Card`, and the primary button at the top of `/styleguide`. Push the branch and confirm the look on the Vercel preview. Satisfies **AC-8**, **AC-12**, **AC-13**, **AC-14**.

**Milestone 2: the full component layer**
4. Add `Button` `secondary`, restyle `TextField` (rounded, filled, violet focus, red errors), `StatusIndicator` (green), `SectionLabel` and `Text` (muted, body, heading), and `Divider` (faded ends). Satisfies **AC-8**, **AC-9**, **AC-10**, **AC-13**.
5. Build `TerminalCard`, `Chip`, and `Card glow`. Satisfies **AC-13**.
6. Recolor `ActionLink` and its letter roll to violet. Satisfies **AC-7**.
7. Apply the reduced motion rules to the new motion (glow fade, button, card halo) and confirm the `noscript` rule covers revealing glows. Satisfies **AC-5**, **AC-6**.

**Milestone 3: reference and proof**
8. Fill `/styleguide` with every swatch (ratio on `base`), both tones, every glow hue and size, radius and shadow specimens, and every primitive state. Update unit tests beside each changed primitive and `e2e/design-system.spec.ts` for the critical scenarios above. Satisfies **AC-14**, plus end to end checks of **AC-2** through **AC-13** and **AC-16**.
9. Rewrite `docs/design.md` for the new system and regenerate this spec's `verify.md`. Satisfies **AC-15**.

## Migration plan

**Strategy**: big bang on the feature branch (no migration needed in production). Nothing from this feature has merged or shipped, so the old tokens are replaced directly rather than run side by side.
**Phases**:
1. Milestone 1 swaps the palette and every class reference in one commit, so no screen ever mixes amber and violet.
2. Milestones 2 and 3 restyle and add primitives on top.
**Rollback**: revert the milestone commits on `feat/design-system-motion`; the amber version is the prior commit `faab7de`.
**Risks**: a missed old class name silently renders with no color once `--color-*: initial` removes it. Mitigation: after task 1, search `src/` for `amber`, `text-white`, `text-gray`, `bg-black`, and `surface`; any hit is a bug.

## Consequences

**Positive**:
- The page gains depth (void, base, raised, overlay) without losing contrast; every text color clears AA on every surface, enforced by the matrix test.
- Cards, chips, and the terminal card are ready for features 6, 7, and 8, so those sections compose instead of inventing surfaces.
- A clear primary action (the light button) gives the hero and the connect form an obvious focal point.

**Negative / tradeoffs**:
- The look is now close to Cole James. The amber identity is gone; Atticus will need its own details (copy, wordmark, terminal content) to avoid reading as a copy.
- The scope's "Fixed by you" rules (pure black everywhere, amber only, no gradients, no boxes) no longer match this spec until `/scope` updates them.
- More surface area: four new primitives, a texture utility, glows, and shadows mean more to test and more ways to break restraint. The invariants above are the guardrail.
- Gradients cost some paint time. Glows are static after one fade and use no `filter`, but many large glows on one screen can still hurt low end phones; keep at most two per viewport.
- On iOS a tap can leave a `Card glow` halo lit through `:focus-within` until focus moves (accepted).
- The `violet` focus ring sits close to link color; it relies on the 3px offset outline shape, not hue, to stand out.
- Reveal content is still hidden until hydration, and failed hydration still hides it (accepted risk from the first version, unchanged).
- Motion values still live in two places, held together by a test.

**Neutral**:
- The already written tests change broadly (colors in assertions). Behavior tests for motion, keyboard, and accessibility carry over.
- `verify.md` is regenerated by `/develop`; the previous one tested amber values.

## Follow-up

- [ ] Update the scope's "Fixed by you" rules with `/scope` to match this spec: void hero plus violet obsidian sections, violet for interactive elements, green status, red errors, cards and rounded controls allowed, gradients only for texture and glows.
- [ ] Root `AGENTS.md` `## Rules` still says pure black, `#888888` body, amber only, no gradients or boxes, and "visible amber focus". `/sync` should update it after this ships.
- [ ] `mui-base`, `base-ui-react`, and `web-styling-cva` are not yet listed in root `AGENTS.md` `## Agent skills`; they are project wide UI conventions and belong at root.
- [ ] Feature 4 (hero and navigation) uses `Section tone="void"` with `Glow reveal={false}` at the top and bottom, sets `--spacing-anchor` to the real nav height, and decides whether the nav becomes a floating pill like the reference.
- [ ] Feature 5 must block form submission while pending (an `onSubmit` guard, or the Server Action ignoring a duplicate), because pressing Enter inside a field submits the form even when the button is only `aria-disabled`; add one test for it.
- [ ] Feature 4 adds an e2e check that the home page shows at most two glows per viewport.
- [ ] Feature 5 builds its form from `TextField` and `Button` (`primary` for submit). Feature 6 uses `Card` (with `glow`). Feature 7 uses `TerminalCard` and `Chip`. Feature 8 uses `Card` or `Divider` rows. Feature 9 may use a large faded wordmark with a bottom `Glow`.
- [ ] Feature 10 excludes `/styleguide` from the sitemap.
- [ ] The original page brief (all section copy) is not in the repo. Adding it (for example `docs/brief.md`) would give every later `/architect` run the same source.
