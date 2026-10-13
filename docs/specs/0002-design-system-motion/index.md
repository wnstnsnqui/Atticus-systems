# 0002. Build the Atticus design system and motion foundation

**Date**: 2026-10-13
**Status**: In Progress

## Summary

This spec sets the visual language every section of the Atticus page is built from: the color tokens (named, reusable values), the Satoshi and Geist Mono typefaces, a fluid type and spacing scale, and one shared scroll reveal pattern. It takes its feel from colejames.io (large calm headings, uppercase mono labels, hairlines, word by word heading reveals, letter roll on hover) while keeping your fixed rules: pure black, white headings, gray body, amber only for interactive and status elements. You get a small set of primitives (building blocks such as Heading, Section, Button, TextField), a `/styleguide` page that shows them on every preview deploy, and a `docs/design.md` reference. Every text color passes WCAG AA on black, every animation respects reduced motion, and content stays readable with JavaScript off.

## Requirements

**User stories**:
- As a visitor, I want the page to feel calm, premium, and fast, so that I trust Atticus with serious engineering work.
- As a visitor who prefers reduced motion, uses a keyboard, or uses a screen reader, I want the same content and controls without movement or barriers, so that the site works for me too.
- As the developer building each section, I want tokens, primitives, and one motion pattern ready to use, so that every section looks consistent and I never invent a value.

**Acceptance criteria**:
- **AC-1**: All colors are defined once as tokens in `src/app/globals.css` with the exact values in *Feature design*, and Tailwind's default palette is removed (`--color-*: initial`). The text tokens `white`, `gray`, `muted`, and `amber` reach at least 4.5:1 contrast on `#000000`, and `field-line` reaches at least 3:1. A Vitest test parses the tokens from `globals.css` and fails if any of them drops below its threshold.
- **AC-2**: Satoshi (one self hosted variable woff2: weight 400 for body, 500 for headings) and Geist Mono (from the pinned `geist` package; used for labels and log text) load through `next/font` with no network fetch at build time. The live page makes no font request to any third party origin, the CSP stays unchanged, and the cumulative layout shift (CLS) measured on `/styleguide` stays below 0.01.
- **AC-3**: The fluid type scale (display 40 to 96px, h1 32 to 64px, h2 24 to 40px, h3 20 to 28px, body 16 to 18px, label 12 to 13px) and the spacing tokens (container 1280px outer width including gutters, gutters 24 to 48px, section padding 96 to 192px, anchor scroll margin) exist as Tailwind theme tokens. At 320px viewport width nothing scrolls horizontally, including a display size heading containing the word "Infrastructure" (headings wrap long words).
- **AC-4**: Content wrapped in `Reveal` (or `RevealItem` inside a `RevealGroup`) fades in while rising 16px over 600ms with the shared ease out curve, the first time any part of it is at least 10% of the viewport height inside the bottom edge. It never replays on scroll back. `RevealGroup` staggers its items by 60ms. `RevealWords` reveals a heading word by word, 40ms apart, each word rising `0.3em` over 600ms. Reveals animate only `opacity` and `transform`, so they cause zero layout shift.
- **AC-5**: When the visitor's system requests reduced motion: reveals become a 150ms opacity fade with no movement and no stagger (`RevealWords` fades the whole heading as one block). The letter roll is off. The status halo is hidden, leaving a static dot. Smooth anchor scrolling is off (already in place from spec 0001).
- **AC-6**: With JavaScript disabled, every `Reveal`, `RevealItem`, and `RevealWords` child is fully visible and in its final position.
- **AC-7**: `ActionLink` (`next/link` for internal targets, a plain anchor with `target="_blank" rel="noopener noreferrer"` when `external`) and `Button` (Base UI) render amber text. On devices with a hover capable pointer, hover and keyboard focus run a letter roll: each letter slides up out of its clip box while a copy rises from below, 10ms apart, 250ms each. It holds while hovered or focused and reverses on leave. Screen readers announce the label once, as normal text, and the optional trailing `→` is hidden from them, so the accessible name equals the label. Keyboard focus shows a 2px amber outline with a 4px offset, only on `:focus-visible`, never on mouse click. A `Button` in its pending state shows the caller's `pendingLabel`, stays amber at full opacity, turns the letter roll off, stays focusable, announces itself as disabled, and ignores both click and Enter (no double submit).
- **AC-8**: `TextField` (Base UI Field; a single line input or, with `multiline`, a textarea) shows a visible label in the mono label style, tied to the control. There is never placeholder text. Input text is white at body large size with an amber caret. At rest it has a 1px `#666666` underline; on focus, a 2px amber underline (it shows no outline ring). In the error state, the underline is 1px amber at rest and 2px when focused, and an amber message prefixed `ERR //` (in mono) appears below, linked to the control through `aria-describedby`, with `aria-invalid="true"` on the control. Browser autofill keeps a black background and white text. It works fully by keyboard.
- **AC-9**: `StatusIndicator` renders an 8px amber dot (decorative, hidden from assistive tech) next to its text label. A halo behind the dot grows and fades every 2.4s. The meaning always lives in the text, never in the color alone.
- **AC-10**: `SectionLabel` renders `NN // LABEL` (index zero padded to two digits, label uppercased in CSS) in Geist Mono, gray `#888888`, with wide tracking. Given `index={1}` and `Services`, it reads `01 // SERVICES`.
- **AC-11**: `/styleguide` shows every color token as a swatch with its contrast ratio, every type step, the spacing tokens, and every primitive (hover and focus live; error and pending set through props). It is prerendered (exports `ensureStatic`), carries `noindex`, passes an axe scan with zero violations, and returns HTTP 404 in a build made with `VERCEL_ENV=production`, which CI checks on every run.
- **AC-12**: `docs/design.md` documents tokens, type, spacing, the motion rules (durations, easing, reduced motion, the no JavaScript fallback, where reveals may and may not be used), usage rules (amber only on interactive and status elements, no boxes, no gradients, hairlines only where listed), the primitive inventory with props, and the pinned versions of `motion`, `@base-ui/react`, and `geist`.
- **AC-13**: Text selection is a white background with black text. The home page still passes the `ensureStatic` build guard, and no page logs a CSP violation.

## Decision

**Chosen option**: Option 1: Tailwind theme tokens, your own primitives with Base UI for fields and buttons, and Motion for reveals.

Define every token in Tailwind v4 `@theme`, build a small set of typed primitives with `cva` and `clsx`, base `TextField` and `Button` on `@base-ui/react`, and run all reveals through Motion (`LazyMotion` + `m`), with a CSS only letter roll and status halo.

**Implementation skills**: `tailwind-4-docs` (`lombiq/tailwind-agent-skills`, `.claude/skills/tailwind-4-docs/`) · `tailwind-design-system` (`wshobson/agents`, `.claude/skills/tailwind-design-system/`) · `web-styling-cva` (`agents-inc/skills`, `.claude/skills/web-styling-cva/`) · `base-ui-react` (`secondsky/claude-skills`, `.claude/skills/base-ui-react/`) · `mui-base` (`pproenca/dot-skills`, `.claude/skills/mui-base/`) · `framer-motion-animator` (`patricio0312rev/skills`, `.claude/skills/framer-motion-animator/`) · `animate` (`emilkowalski/skills`, `.claude/skills/animate/`) · `emil-design-eng` (`emilkowalski/skills`, `.claude/skills/emil-design-eng/`) · `apple-design` (`emilkowalski/skills`, `.claude/skills/apple-design/`) · `pick-ui-library` (`emilkowalski/skills`, `.claude/skills/pick-ui-library/`) · `vitest` (`antfu/skills`, `.claude/skills/vitest/`) · `playwright-best-practices` (`currents-dev/playwright-best-practices-skill`, `.claude/skills/playwright-best-practices/`)

> Heads up for the build: both Base UI skills import from the deprecated `@base-ui-components/react`. Install and import from **`@base-ui/react`** (1.9.0 at spec time) and translate their examples accordingly. Check each Base UI prop named here (`invalid`, `match`, `focusableWhenDisabled`, `render`) against the installed version's types before relying on it.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).

## Feature design

**Data model sketch**: no persisted data. The model of this feature is the token set below. Colors, type, spacing, easing, durations, and keyframes live only in `src/app/globals.css`. Motion needs numbers in JavaScript, so `src/lib/motion.ts` holds the motion values, and a test asserts the CSS custom properties match it. That is the one deliberate mirror.

*Color tokens* (`@theme`, which starts with `--color-*: initial;`; contrast on `#000000`):

| Token | Value | Use | Contrast test |
|---|---|---|---|
| `--color-black` | `#000000` | page background, text on white selection | excluded |
| `--color-white` | `#FFFFFF` | headings, input text, selection background | 21:1, needs ≥ 4.5 |
| `--color-gray` | `#888888` | body copy, section and field labels | 5.92:1, needs ≥ 4.5 |
| `--color-muted` | `#777777` | copyright and small meta lines, field descriptions | 4.69:1, needs ≥ 4.5 |
| `--color-amber` | `#FFB000` | interactive elements, focus, caret, status, errors | 11.46:1, needs ≥ 4.5 |
| `--color-field-line` | `#666666` | text field underline at rest (UI component boundary) | 3.66:1, needs ≥ 3 |
| `--color-hairline` | `#262626` | decorative 1px dividers between portfolio rows | excluded (decorative) |
| `--color-surface` | `#0A0A0A` | media placeholders only (portfolio 16:9 frames) | excluded (decorative) |

No other color may appear. Never use opacity to dim text (60% of `#888888` fails AA). The `html` and `body` base styles in `@layer base` replace the hex values currently in `globals.css` with these tokens.

*Type tokens* (`@theme`; fluid between a 375px and a 1440px viewport):

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

Each row uses Tailwind v4 sub tokens (`--text-h1--line-height`, `--text-h1--letter-spacing`, `--text-h1--font-weight`). Fonts are wired with `@theme inline`: `--font-sans: var(--font-satoshi), ui-sans-serif, system-ui, sans-serif` and `--font-mono: var(--font-geist-mono), ui-monospace, monospace`. Body default is `font-sans text-body text-gray`. Mono text uses `font-variant-numeric: tabular-nums`. All headings get `overflow-wrap: break-word; hyphens: auto` (the root layout already sets `lang="en"`, which `hyphens: auto` needs).

*Spacing and layout tokens*: Tailwind's default `--spacing: 0.25rem` scale stays, plus these:
- `--container-content: 80rem`: the 1280px outer width, gutters included, so the text width is 1280px minus two gutters.
- `--container-prose: 40rem`: the body text measure.
- `--spacing-gutter: clamp(1.5rem, 0.97rem + 2.25vw, 3rem)`.
- `--spacing-section: clamp(6rem, 3.89rem + 9.01vw, 12rem)`.
- `--spacing-anchor: 6rem`: the scroll margin under the nav. Feature 4 sets it to the real nav height.

Breakpoints stay at Tailwind defaults.

*Motion tokens*. `src/lib/motion.ts` stores durations and staggers as numbers in milliseconds and exports a `toSeconds(ms)` helper for Motion, which takes seconds. The CSS mirror lives in `globals.css`: easing as `--ease-*` inside `@theme`, durations and the letter stagger as plain `:root` custom properties (Tailwind has no duration namespace). The mirror test checks that each CSS value equals `${ms}ms` and that the easing strings match.

| `motion.ts` name | CSS mirror | Value | Used by |
|---|---|---|---|
| `ease.out` | `--ease-out-strong` | `cubic-bezier(0.23, 1, 0.32, 1)` | reveals, letter roll, field underline |
| `duration.fast` | `--duration-fast` | 150 | color changes, reduced motion fade, underline |
| `duration.roll` | `--duration-roll` | 250 | each letter in the hover roll |
| `duration.reveal` | none | 600 | `Reveal`, `RevealItem`, `RevealWords` |
| `duration.pulse` | `--duration-pulse` | 2400 | status halo loop |
| `stagger.letters` | `--stagger-letters` | 10 | letter roll delay per letter |
| `stagger.words` | none | 40 | `RevealWords` |
| `stagger.children` | none | 60 | `RevealGroup` |
| `reveal.distance` | none | 16 (px) | block rise |
| `reveal.wordDistance` | none | `"0.3em"` | word rise |
| `reveal.viewport` | none | `{ once: true, amount: "some", margin: "0px 0px -10% 0px" }` | all reveals |

*Global base styles*: `::selection { background: white; color: black }`; `:focus-visible { outline: 2px solid var(--color-amber); outline-offset: 4px }` with square corners, reset to `outline: none` on the `TextField` control (whose focus indicator is the underline); `html` keeps `color-scheme: dark` and the existing smooth scroll rules.

**State transitions**: each reveal element moves `hidden → visible` exactly once per page load (Motion `whileInView` with `viewport.once: true`). There is no path back to `hidden`. The letter roll is a CSS state, `rest ↔ rolled`, tied to `:hover` and `:focus-visible`.

**API surface** (component props; all under `src/components/ui/`, named exports, one file each plus a colocated `*.test.tsx`):

| Primitive | Kind | Key props | Renders | Notes |
|---|---|---|---|---|
| `Container` | server | `children`, `className?` | `div`, `max-w-content`, `px-gutter`, `mx-auto` | |
| `Section` | server | `id: string` (req), `labelledBy?`, `children` | `section` with `id`, `py-section`, `scroll-mt-anchor` | anchor target for nav and footer links |
| `Heading` | server | `level: 1 \| 2 \| 3` (req), `size?: "display" \| "h1" \| "h2" \| "h3"` (default: level 1 → `h1`, 2 → `h2`, 3 → `h3`; `display` only by opt in), `id?` | `h1`/`h2`/`h3`, white, `cva` variant | size and level are separate so the outline stays correct |
| `Text` | server | `size?: "lg" \| "base" \| "sm"` (default `base`), `tone?: "body" \| "muted" \| "strong"` (default `body`), `as?: "p" \| "span" \| "li"` (default `p`) | gray / muted / white | |
| `SectionLabel` | server | `index: number` (req, 1 to 99), `children: string` (req) | `p` in mono label style | output `NN // LABEL` |
| `Divider` | server | `className?` | `hr` with `aria-hidden="true"`, 1px `hairline` | decorative; never the only separator cue |
| `SplitLetters` | shared (no hooks, no `"use client"`, usable from both) | `children: string` | `sr-only` full text + an `aria-hidden` wrapper of per letter clip spans, each with `data-char` and `--i` (spaces kept with `white-space: pre`) | used by `ActionLink` and `Button` |
| `ActionLink` | server | `href: string` (req), `children: string` (req), `arrow?: boolean`, `external?: boolean` | `next/link` (internal) or `a` (external, `target="_blank" rel="noopener noreferrer"`) with `SplitLetters`; `→` in an `aria-hidden` span | amber, letter roll |
| `Button` | client | `children: string` (req), `pendingLabel?: string`, `pending?: boolean`, `arrow?: boolean`, `type?` (default `"button"`), rest of `Omit<BaseButtonProps, "children">` | Base UI `Button` with `SplitLetters` | `pending` sets `disabled` + `focusableWhenDisabled` and swaps the label to `pendingLabel ?? children` |
| `TextField` | client | `name` (req), `label` (req), `multiline?`, `error?: string`, `description?`, input props except `placeholder` | Base UI `Field.Root invalid={!!error}`, `Field.Label`, `Field.Control` (or `render={<textarea />}`), `Field.Description`, `Field.Error match={!!error}` | message text `ERR // {error}`; ids from Base UI (unique per field) |
| `StatusIndicator` | server | `children: string` (req) | `span` with an 8px dot (`aria-hidden`) whose `::after` halo animates `scale` 1 → 2.5 and `opacity` 0.6 → 0, plus the text | halo `display: none` under reduced motion |
| `MotionProvider` | client | `children` | `LazyMotion features={domAnimation} strict` + `MotionConfig reducedMotion="user"` | wraps `children` in `src/app/layout.tsx` |
| `Reveal` | client | `children`, `as?: "div" \| "p" \| "li"` (default `div`), `delay?: number` (ms) | `m.*` element with `data-reveal` | fade + rise once |
| `RevealGroup` | client | `children`, `as?: "div" \| "ul" \| "ol"` (default `div`) | `m.*` parent, `staggerChildren` 60ms (0 under reduced motion), no `data-reveal` itself | only `RevealItem` children animate |
| `RevealItem` | client | `children`, `as?: "div" \| "li" \| "p"` (default `div`) | `m.*` element with `data-reveal`, inherits the group's variants | must sit inside a `RevealGroup` |
| `RevealWords` | client | `text: string` (req), `level: 1 \| 2 \| 3` (req), `size?` (same defaults as `Heading`) | heading containing `sr-only` text + an `aria-hidden` wrapper of word spans, each an `m.span` with `data-reveal` | markup always split the same way; under reduced motion the parent fades and word transitions have `duration: 0` |

Route: `src/app/styleguide/page.tsx`. It is static, exports `ensureStatic`, sets `metadata.robots = { index: false, follow: false }`, renders its own `<main>`, and calls `notFound()` when `isStyleguideEnabled(env.VERCEL_ENV)` is false. The pure helper `isStyleguideEnabled` lives in `src/app/styleguide/visibility.ts`, with a unit test. Swatches on this page are the one place filled color blocks are allowed.

Layout additions in `src/app/layout.tsx`: the font `className` variables on `<html>`, `<MotionProvider>` around `children`, and in `<head>` a `<noscript><style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style></noscript>`.

CI addition in `.github/workflows/ci.yml`: after the normal build, run `VERCEL_ENV=production pnpm build`, start the server, and assert that `GET /styleguide` returns 404 (a small script in `scripts/check-styleguide-gate.mjs`).

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Any primitive | color, size, spacing values | tokens in `src/app/globals.css`, values fixed by this spec |
| Contrast test and `/styleguide` swatches | each color token's hex value | `parseColorTokens(css)` in `src/lib/design/tokens.ts`, which reads the first `@theme` block (not `@theme inline`) of `globals.css`. `/styleguide` reads the file at build time with `fs`, which is fine in a prerendered server component |
| Contrast test | which tokens are tested, and their thresholds | the *Contrast test* column above, as a constant map in the test |
| Contrast ratio | ratio formula | WCAG 2.x relative luminance, pure function `contrastRatio(a, b)` in `src/lib/design/contrast.ts` |
| `Reveal`, `RevealItem`, `RevealWords` | duration, easing, distance, stagger, viewport | `src/lib/motion.ts` (ms converted with `toSeconds`) |
| Letter roll, halo, field underline | duration, easing, letter delay | CSS custom properties mirrored from `src/lib/motion.ts`; the mirror test asserts they match |
| Letter roll | each letter's delay | `--i` set per span by `SplitLetters` from the letter index; `transition-delay: calc(var(--i) * var(--stagger-letters))` |
| Letter roll | the rising copy | `::after { content: attr(data-char) }` positioned one line below inside the static clip span; an inner element translates `-100%` on hover or focus |
| Reduced motion branch (JS) | whether the visitor asked for reduced motion | Motion `useReducedMotion()`, read only to choose `transition` values, never to change markup (the server cannot know it, and the first client render must match) |
| Reduced motion branch (CSS) | same | `@media (prefers-reduced-motion: reduce)`; the letter roll is additionally gated on `@media (hover: hover)` |
| No JavaScript fallback | final visible state | `<noscript>` style overriding Motion's inline initial styles on `[data-reveal]` |
| `SectionLabel` | `01 // SERVICES` | `index` prop zero padded by `String(index).padStart(2, "0")`; label from `children`, uppercased in CSS so screen readers read the source case |
| `TextField` error message | message text | `error` prop from the caller (feature 5 passes its Server Action field errors) |
| `Button` pending | pending flag and label | `pending` and `pendingLabel` props from the caller (feature 5 passes `useActionState`'s pending state and its own wording) |
| `/styleguide` 404 gate | whether this is a production build | `env.VERCEL_ENV` (already validated in `src/lib/env.ts`), read at build time during prerender |
| Satoshi font | `src/app/fonts/Satoshi-Variable.woff2` + its licence | downloaded by `/develop` from the official Fontshare Satoshi package (ITF Free Font License, free for commercial use) and committed; `localFont` with `adjustFontFallback: "Arial"` |
| Geist Mono font | font files | the `geist` npm package (`geist/font/mono`, exact pin), bundled locally |
| Library versions | exact versions | latest stable at install, pinned exact by the project's `saveExact`, recorded in `docs/design.md` |
| Section scroll margin | nav height | `--spacing-anchor: 6rem` now; feature 4 updates the value |

**Key invariants**:
- Amber appears only on links, buttons, focus outlines, the caret, field focus and error states, and status indicators. Never on body text, headings, labels, or decoration.
- No backgrounds other than black (except `surface` for media placeholders and the `/styleguide` swatches), no gradients, no shadows (the one exception is the inset shadow that keeps autofilled fields black), no rounded boxes, no bordered cards. Lines are limited to the `hairline` between portfolio rows and the `field-line` under form fields.
- Reveals animate only `opacity` and `transform`. Nothing visible in the first viewport on load is wrapped in `Reveal` (the hero gets its own entrance in feature 4), so the largest contentful paint never waits for JavaScript. Never wrap a whole section in `Reveal`; wrap its blocks.
- Every element Motion hides initially carries `data-reveal`, so the `noscript` fallback always covers it.
- The reduced motion choice changes only transitions, never markup. Hidden variants always include `y`, and under reduced motion the `y` transition has zero duration.
- Split text (letters or words) always pairs an `sr-only` full string with an `aria-hidden` visual copy. Assistive tech never reads fragments.
- Motion is imported only through `m` components inside `LazyMotion` (`strict` mode throws if a full `motion` component sneaks in). Motion code lives only in client components. Primitives without motion stay server components.
- The home page keeps exporting `ensureStatic`, and `/styleguide` exports it too. No request APIs are read anywhere.
- No new third party origin, and no network at build time for fonts. The CSP in `next.config.ts` stays as it is.
- Each token value exists once in `globals.css`. The only mirror is `motion.ts`, guarded by its test.

**Security model**: public, static, no user data. Nothing to authorize. `/styleguide` is hidden from search engines everywhere, returns 404 in production builds, and that is checked in CI. `TextField` renders untrusted error strings only as React text, never as HTML. External `ActionLink`s use `rel="noopener noreferrer"`.

**Configuration required**: none new. `VERCEL_ENV` is already in `src/lib/env.ts`. New dependencies, pinned exact: `motion`, `@base-ui/react` (1.9.0 at spec time), `geist`, `class-variance-authority` (0.7.1), `clsx` (2.1.1).

**Critical test scenarios**:
- Happy path: on `/styleguide`, scroll down. Each reveal block fades and rises once, and the heading reveals word by word. Scrolling back up and down does not replay it. A `Reveal` taller than the viewport still reveals. Verifies **AC-4**, **AC-11**.
- Contrast guard: a fixture CSS with `--color-muted: #666666` makes the contrast test fail. Verifies **AC-1**.
- Reduced motion: with Playwright `reducedMotion: "reduce"`, reveal targets reach `opacity: 1` with `transform: none` within 300ms. Heading words share one fade, hovering an `ActionLink` moves no letter, and the status halo is not displayed. Verifies **AC-5**, **AC-9**.
- No JavaScript: with `javaScriptEnabled: false`, every `[data-reveal]` element computes `opacity: 1`. Verifies **AC-6**.
- Keyboard: tabbing to an `ActionLink` and a `Button` shows the amber outline, and tabbing to a `TextField` shows the 2px amber underline and no outline. Clicking with a mouse shows no outline. Verifies **AC-7**, **AC-8**.
- Screen reader names: `getByRole("link", { name: "Initialize Pipeline" })` (rendered with `arrow`) and `getByRole("heading", { name: <full text> })` each match exactly once. Verifies **AC-7**, **AC-4**.
- Pending button: with `pending`, the button shows `pendingLabel`, has `aria-disabled="true"`, keeps focus, and neither click nor Enter fires `onClick` or submits its form. Verifies **AC-7**.
- Field error: `TextField` with `error="Enter a valid email"` gives `aria-invalid="true"` and an accessible description containing `Enter a valid email`. Verifies **AC-8**.
- Production gate: `isStyleguideEnabled("production")` is false, and true for `"preview"`, `"development"`, and `undefined`. The CI script gets a 404 from a `VERCEL_ENV=production` build. Verifies **AC-11**.
- Layout: at 320px width, with a display heading containing "Infrastructure", `document.documentElement.scrollWidth <= 320`. Verifies **AC-3**.
- Fonts, CLS, and CSP: loading `/` and `/styleguide` logs no console or CSP errors, every font request is same origin, and the summed `layout-shift` entries (via `PerformanceObserver`) stay below 0.01. Verifies **AC-2**, **AC-13**.
- Accessibility: an axe scan of `/styleguide` reports zero violations. Verifies **AC-11**.

## Build plan

Ordered as a Tracer Bullet: first a thin thread from font file to a deployed preview page, then thicken it one layer at a time.

**Milestone 1: thin thread live on a preview**
1. Download Satoshi's variable woff2 and licence into `src/app/fonts/`. Install `geist`. Wire `localFont` (`variable: "--font-satoshi"`, `weight: "300 900"`, `display: "swap"`, `adjustFontFallback: "Arial"`) and Geist Mono (`variable: "--font-geist-mono"`) in `layout.tsx`. Satisfies **AC-2**.
2. Add the color tokens (with `--color-*: initial`), the `@theme inline` font tokens, the `@layer base` html and body styles, selection, and focus to `globals.css`. Satisfies **AC-1**, **AC-7** (focus), **AC-13**.
3. Create `/styleguide` with `visibility.ts` (plus its test), `ensureStatic`, `noindex`, and its own `<main>`, showing the palette and one heading and paragraph. Add the CI production gate script. Push the branch and confirm it on the Vercel preview. Satisfies **AC-11**, **AC-2**.

**Milestone 2: tokens, type, and layout primitives**
4. Add the type, spacing, container, easing, and duration tokens. Add `src/lib/motion.ts`, `src/lib/design/tokens.ts` (`parseColorTokens`), `src/lib/design/contrast.ts`, and their tests (contrast thresholds, motion mirror). Satisfies **AC-1**, **AC-3**.
5. Install `clsx` and `class-variance-authority`. Build `Container`, `Section`, `Heading`, `Text`, `SectionLabel`, and `Divider` with tests, and render them on `/styleguide`. Satisfies **AC-3**, **AC-10**.

**Milestone 3: motion system**
6. Install `motion`. Build `MotionProvider` and add it to the layout, plus the `noscript` fallback. Build `Reveal`, `RevealGroup`, `RevealItem`, and `RevealWords` with their reduced motion transitions, and tests. Satisfies **AC-4**, **AC-5**, **AC-6**.

**Milestone 4: interactive and status primitives**
7. Build `SplitLetters` and `ActionLink` with the CSS letter roll (gated on `hover: hover` and `prefers-reduced-motion: no-preference`). Satisfies **AC-7**, **AC-5**.
8. Install `@base-ui/react`. Build `Button` (pending state) and `TextField` (rest, focus, error, autofill, and the `multiline` textarea). Satisfies **AC-7**, **AC-8**.
9. Build `StatusIndicator` with the halo keyframes in `@theme` (`--animate-status-pulse`). Satisfies **AC-9**, **AC-5**.

**Milestone 5: reference and proof**
10. Fill `/styleguide` with every token swatch (with contrast ratios from `parseColorTokens`) and every primitive state. Write `e2e/design-system.spec.ts` covering the critical scenarios above. Satisfies **AC-11**, plus end to end checks of **AC-2** through **AC-9** and **AC-13**.
11. Write `docs/design.md`: tokens, type, spacing, motion rules, usage rules, the primitive inventory, and pinned versions, linking back to this spec. Satisfies **AC-12**.

## Consequences

**Positive**:
- Every section after this builds from named tokens and ready primitives. Visual drift and invented values become a review flag, not a habit.
- Accessibility is built into the primitives (contrast test, focus, split text pattern, reduced motion, no JavaScript fallback), so section features inherit it instead of redoing it.
- The `/styleguide` preview lets you judge the feel on a real deploy before the hero exists.

**Negative / tradeoffs**:
- Satoshi is not on Google Fonts, so a binary font file and its licence live in the repo and are updated by hand.
- Base UI adds a dependency that today powers only two primitives. Its skills reference an old package name, so examples need translating.
- Reveal content is hidden until hydration. Below the fold that is invisible to visitors, but slow devices may briefly see blank space where a block will fade in.
- Accepted risk: if JavaScript loads but React fails to hydrate, reveal content stays hidden (the `noscript` fallback does not apply). On a static page with no data fetching this is rare, and `error.tsx` covers render errors. Revisit with a CSS failsafe if it ever shows up in error tracking (feature 11).
- The letter roll creates one span per letter. That is fine for short CTA labels, and the reason it must not be used on body text.
- Motion values live in two places (TypeScript and CSS), held together only by a test.
- Field focus uses an amber underline instead of the outline ring, a deliberate exception so fields do not become boxes.
- CI gains one extra production build for the `/styleguide` gate, a minute or two per run.

**Neutral**:
- `/styleguide` exists on previews and locally, never in production. Feature 10 must keep it out of the sitemap.
- Primitive variants grow per feature. A new variant should land in this system, not inline in a section.

## Follow-up

- [ ] `mui-base`, `base-ui-react`, and `web-styling-cva` were installed during this design and are not yet in root `AGENTS.md` `## Agent skills`. They are project wide UI conventions and belong at root. Note there that Base UI skills use the deprecated `@base-ui-components/react` name.
- [ ] Root `AGENTS.md` should point to `docs/design.md` once it exists (a one line pointer, `/sync` owns it).
- [ ] The scope header still says `pick-ui-library` is not installed. It is, and the UI library is now chosen here (Base UI). Refresh it with `/scope` or `/sync`.
- [ ] Feature 4 (hero and navigation) sets `--spacing-anchor` to the real nav height and owns the hero's load entrance (hero content must not use `Reveal`).
- [ ] Feature 5 builds its form from `TextField` and `Button` and passes `error`, `pending`, and `pendingLabel`. Feature 7's terminal log uses `font-mono` and the reduced motion rules here. Feature 8 uses `--color-surface` and `Divider`. Feature 12 uses `ActionLink` for internal legal links.
- [ ] Feature 10 excludes `/styleguide` from the sitemap.
- [ ] The original page brief (all section copy) is not in the repo. Adding it (for example `docs/brief.md`) before the section specs would give every later `/architect` run the same source.
