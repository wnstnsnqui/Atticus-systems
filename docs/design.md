---
source: spec
spec: docs/specs/0002-design-system-motion/index.md
tokens: src/app/globals.css
motion: src/lib/motion.ts
---

# Atticus design system

**Character:** calm, premium, engineered. Large quiet headings, uppercase mono labels, lots of black space, and motion that is felt more than seen. Feel taken from colejames.io, held to the fixed scope rules.

You can see every token and primitive live on `/styleguide` (local and preview deploys only, it returns 404 in production). Decisions and their reasons live in [spec 0002](specs/0002-design-system-motion/index.md).

## Build mandate

- Build every section from the tokens and primitives below. If you need a value or variant that does not exist, add it here and in `globals.css` first, never inline in a section.
- Pure black page. White headings, gray body. **Amber only on links, buttons, focus outlines, the caret, field focus and error states, and status indicators.** Never on body text, headings, labels, or decoration.
- No gradients, no shadows (the autofill inset shadow is the one exception), no rounded boxes, no bordered cards, no background other than black. `surface` is for media placeholders only.
- Lines only where listed: `hairline` between portfolio rows, `field-line` under form fields.
- Never dim text with opacity. 60% of `#888888` fails AA. Use `muted` instead.

## Tokens

All values live once in [`src/app/globals.css`](../src/app/globals.css). Tailwind's default palette is removed (`--color-*: initial`), so only these colors exist.

### Color (contrast on `#000000`)

| Token | Value | Use | Contrast |
|---|---|---|---|
| `black` | `#000000` | page background, text on selection | n/a |
| `white` | `#FFFFFF` | headings, input text, selection background | 21:1 |
| `gray` | `#888888` | body copy, section and field labels | 5.92:1 |
| `muted` | `#777777` | meta lines, copyright, field descriptions | 4.69:1 |
| `amber` | `#FFB000` | interactive and status elements only | 11.46:1 |
| `field-line` | `#666666` | text field underline at rest | 3.66:1 (needs 3) |
| `hairline` | `#262626` | decorative dividers between portfolio rows | decorative |
| `surface` | `#0A0A0A` | media placeholders (16:9 frames) | decorative |

`src/lib/design/contrast.test.ts` fails the build if `white`, `gray`, `muted`, or `amber` drop below 4.5:1, or `field-line` below 3:1.

### Type

Satoshi (self hosted variable woff2, `src/app/fonts/`, ITF Free Font License) for everything; Geist Mono (`geist` package) for labels, logs, and numbers (tabular figures on). Both load through `next/font` with no network at build time. Sizes are fluid between a 375px and a 1440px viewport.

| Utility | Size | Line height | Tracking | Weight | Face |
|---|---|---|---|---|---|
| `text-display` | 40 → 96px | 1 | -0.035em | 500 | sans |
| `text-h1` | 32 → 64px | 1.05 | -0.03em | 500 | sans |
| `text-h2` | 24 → 40px | 1.15 | -0.02em | 500 | sans |
| `text-h3` | 20 → 28px | 1.25 | -0.01em | 500 | sans |
| `text-body-lg` | 18 → 20px | 1.6 | 0 | 400 | sans |
| `text-body` | 16 → 18px | 1.6 | 0 | 400 | sans |
| `text-small` | 14px | 1.5 | 0 | 400 | sans |
| `text-label` | 12 → 13px | 1.4 | 0.08em | 400 | mono, add `uppercase` |

The body default is `font-sans text-body text-gray`. Headings wrap and hyphenate long words, so nothing scrolls sideways at 320px.

### Spacing and layout

| Utility | Value | Use |
|---|---|---|
| `max-w-content` | 1280px | outer content width, gutters included |
| `max-w-prose` | 640px | body text measure |
| `px-gutter` | 24 → 48px | side gutters |
| `py-section` | 96 → 192px | vertical padding per section |
| `scroll-mt-anchor` | 96px | anchor offset under the nav (feature 4 sets the real nav height) |

Tailwind's default `--spacing` scale and breakpoints stay as they are.

## Motion

Motion values live in [`src/lib/motion.ts`](../src/lib/motion.ts) (milliseconds; convert with `toSeconds`). The CSS mirror (`--ease-out-strong`, `--duration-fast`, `--duration-roll`, `--duration-pulse`, `--stagger-letters`) is kept in sync by `src/lib/motion.test.ts`.

| What | Value |
|---|---|
| Easing (everything) | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Block reveal | 600ms, fade + rise 16px, once |
| Group stagger | 60ms per item |
| Word reveal | 600ms per word, rise 0.3em, 40ms apart |
| Letter roll | 250ms per letter, 10ms apart |
| Color changes, field underline | 150ms |
| Status halo | 2400ms loop, scale 1 → 2.5, opacity 0.6 → 0 |

**Trigger:** a reveal runs the first time any part of it is 10% of the viewport height inside the bottom edge. It never replays.

**Only `opacity` and `transform` animate,** so reveals never shift layout.

**Reduced motion:** reveals become a 150ms fade with no movement and no stagger; `RevealWords` fades the whole heading as one block; the letter roll is off; the status halo is hidden, leaving a static dot; smooth anchor scrolling is off. The setting only changes transitions, never markup.

**No JavaScript:** a `<noscript>` style in the root layout forces every `[data-reveal]` element visible and in place. Every element Motion hides must carry `data-reveal`.

**Where reveals go:**
- Use them on blocks below the first viewport: a paragraph, a grid of cards (`RevealGroup` + `RevealItem`), a section heading (`RevealWords`).
- Never on anything visible in the first viewport on load (the hero owns its own entrance, feature 4), so the largest paint never waits for JavaScript.
- Never wrap a whole section. Wrap its blocks.
- The letter roll is for short CTA labels only (one span per letter), never body text.
- Motion code only in client components, only through `m.*` inside `MotionProvider` (`LazyMotion strict` throws on a full `motion.*` component).

## Primitives

All in `src/components/ui/`, named exports, one file each with a colocated test.

| Primitive | Kind | Props | Notes |
|---|---|---|---|
| `Container` | server | `children`, `className?` | `max-w-content`, `px-gutter`, centered |
| `Section` | server | `id` (req), `labelledBy?`, `children` | anchor target, `py-section`, `scroll-mt-anchor` |
| `Heading` | server | `level: 1 \| 2 \| 3` (req), `size?: "display" \| "h1" \| "h2" \| "h3"`, `id?`, `className?` | size defaults to the level; display is opt in |
| `Text` | server | `size?: "lg" \| "base" \| "sm"`, `tone?: "body" \| "muted" \| "strong"`, `as?: "p" \| "span" \| "li"`, `className?` | gray, muted, or white |
| `SectionLabel` | server | `index: number` (1 to 99), `children: string` | renders `01 // SERVICES` in mono, uppercased in CSS |
| `Divider` | server | `className?` | decorative 1px `hairline`, hidden from assistive tech |
| `SplitLetters` | shared | `children: string`, `labelId?` | `sr-only` label + `aria-hidden` per letter copy |
| `ActionLink` | server | `href` (req), `children: string` (req), `arrow?`, `external?` | amber, letter roll; external opens a new tab with `rel="noopener noreferrer"` |
| `Button` | client | `children: string` (req), `pending?`, `pendingLabel?`, `arrow?`, `type?` (default `"button"`), other Base UI button props | pending: shows `pendingLabel`, stays amber and focusable, `aria-disabled`, ignores click and Enter |
| `TextField` | client | `name` (req), `label` (req), `multiline?`, `error?`, `description?`, input props (never `placeholder`) | mono label, amber caret, 1px `field-line` underline, 2px amber on focus; error adds `aria-invalid` and an `ERR //` message linked by `aria-describedby` |
| `StatusIndicator` | server | `children: string` | 8px amber dot with a pulsing halo; meaning lives in the text |
| `MotionProvider` | client | `children` | wraps the app in the root layout |
| `Reveal` | client | `children`, `as?: "div" \| "p" \| "li"`, `delay?` (ms), `className?` | fade + rise once |
| `RevealGroup` | client | `children`, `as?: "div" \| "ul" \| "ol"`, `className?` | staggers its `RevealItem` children by 60ms |
| `RevealItem` | client | `children`, `as?: "div" \| "li" \| "p"`, `className?` | must sit inside a `RevealGroup` |
| `RevealWords` | client | `text` (req), `level` (req), `size?`, `id?` | heading revealed word by word, announced once |

**Focus:** every focusable element shows a 2px amber outline with a 4px offset on `:focus-visible` only. Text fields are the one exception: their focus indicator is the amber underline, so fields never become boxes.

**Selection:** white background, black text.

## Pinned versions

| Package | Version |
|---|---|
| `motion` | 14.1.0 |
| `@base-ui/react` | 1.9.0 |
| `geist` | 1.7.2 |
| `class-variance-authority` | 0.7.1 |
| `clsx` | 2.1.1 |

Base UI agent skills still import from the deprecated `@base-ui-components/react`. Import from `@base-ui/react`.
