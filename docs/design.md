---
source: spec
spec: docs/specs/0002-design-system-motion/index.md
tokens: src/app/globals.css
motion: src/lib/motion.ts
---

# Atticus design system

**Character:** calm, premium, engineered, with depth instead of flat black. A pure black void for the hero fades into a faintly violet obsidian page. Raised rounded cards, a fine dot texture, and soft violet, blue, and cyan light sit behind large quiet headings and uppercase mono labels. Motion is felt more than seen. Structure borrowed from Vercel Geist (a step role per color, small and large radii), components from colejames.io (light lavender primary button, rounded filled fields, rounded cards, mono chips).

You can see every token and primitive live on `/styleguide` (local and preview deploys only, it returns 404 in production). Decisions and their reasons live in [spec 0002](specs/0002-design-system-motion/index.md).

## Build mandate

- Build every section from the tokens and primitives below. If you need a value or variant that does not exist, add it here and in `globals.css` first, never inline in a section.
- Surfaces are `void` (hero only), `base` (every other section), `raised` (cards, fields), and `overlay` (chips, hover fill). No other background colors.
- **Violet only on links, the focus ring, the caret, the field focus border, selection, and the primary button arrow (`violet-deep`).** Green only for status. Red only for field errors. None of them on body text, headings, or labels.
- Gradients only in the dot texture, the void fade, `Glow`, hover halos, and `Divider`. Shadows only on buttons (`shadow-control`) and the autofill inset.
- Corner radii only from `chip`, `control`, `card`, or full round for dots.
- Never dim text with opacity. Use `muted`.

## Tokens

All values live once in [`src/app/globals.css`](../src/app/globals.css). Tailwind's default color, radius, and shadow scales are removed (`--color-*`, `--radius-*`, `--shadow-*` set to `initial`), so only these exist.

### Color

| Token | Value | Geist role | Use |
|---|---|---|---|
| `void` | `#000000` | background | hero only (`Section tone="void"`) |
| `base` | `#0E0D12` | background | page and every non hero section |
| `raised` | `#15141B` | 100 | cards, terminal cards, field fill, secondary button |
| `overlay` | `#1C1B24` | 200 | chips, terminal window dots, hover fill |
| `hairline` | `#24222E` | 300 | `Divider` line (decorative) |
| `border` | `#2A2836` | 400 | card edge, primary button edge (decorative) |
| `dot` | `#262433` | 300 | dot texture (decorative) |
| `field-line` | `#6E6994` | 600 | field border, secondary button border |
| `muted` | `#8C89A6` | 900 | labels, meta lines, field labels, status text |
| `copy` | `#B2AFCA` | 900 | body copy, chip and terminal text |
| `heading` | `#F6F6F9` | 1000 | headings, input text, emphasized text |
| `violet` | `#A99BFF` | accent 900 | links, focus ring, caret, field focus border, selection |
| `violet-hover` | `#C4BAFF` | accent 1000 | link hover |
| `violet-deep` | `#5B4BDB` | accent 700 | arrow on the light primary button only |
| `button` | `#D6D5E2` | gray 1000 | primary button fill |
| `button-hover` | `#E6E5EF` | gray 1000 hover | primary button hover fill |
| `ink` | `#0E0D12` | text on light | primary button text, selection text |
| `green` | `#4ADE80` | green 900 | status dot and halo only |
| `red` | `#FF6B6B` | red 900 | field error border and message only |
| `glow-violet` | `#6E44FF` | decorative | glows and hover halos |
| `glow-blue` | `#3D6BFF` | decorative | glows |
| `glow-cyan` | `#38B2F8` | decorative | glows |

Body copy is `text-copy`, not `text-body`: `text-body` is already the body font size.

### Contrast pairs

[`src/lib/design/contrast.test.ts`](../src/lib/design/contrast.test.ts) checks every pair below against the real `globals.css` and fails naming each token and surface that drops under its threshold.

| Foreground | On | Needs | Lowest |
|---|---|---|---|
| `heading`, `copy`, `muted`, `violet`, `violet-hover`, `red` | `void`, `base`, `raised`, `overlay` | 4.5 | `muted` on `overlay` 5.07 |
| `heading`, `copy`, `muted`, `violet`, `red` | `dot` | 4.5 | `muted` on `dot` 4.52 |
| `green` | `void`, `base`, `raised`, `overlay` | 3 (graphic) | 9.78 |
| `ink` | `button`, `button-hover` | 4.5 | 13.34 |
| `violet-deep` | `button` | 3 (graphic) | 4.17 |
| `field-line` | `base`, `raised` | 3 (UI boundary) | 3.58 on `raised` |
| `violet` (focus ring) | `void`, `base`, `raised` | 3 | 7.68 |
| `ink` on `violet` (selection) | `violet` | 4.5 | 8.13 |

`muted` on `dot` (4.52) is the tightest pair. Do not darken `muted` or lighten `dot`.

### Type

Satoshi (self hosted variable woff2, `src/app/fonts/`, ITF Free Font License, 400 body and 500 headings) and Geist Mono (`geist` package, tabular figures on) for labels, chips, and terminal text. Both load through `next/font` with no network at build time. Sizes are fluid between a 375px and a 1440px viewport.

| Utility | Size | Line height | Tracking | Weight | Face |
|---|---|---|---|---|---|
| `text-display` | 40 → 96px | 1 | -0.035em | 500 | sans |
| `text-h1` | 32 → 64px | 1.05 | -0.03em | 500 | sans |
| `text-h2` | 24 → 40px | 1.15 | -0.02em | 500 | sans |
| `text-h3` | 20 → 28px | 1.25 | -0.01em | 500 | sans |
| `text-body-lg` | 18 → 20px | 1.6 | 0 | 400 | sans |
| `text-body` | 16 → 18px | 1.6 | 0 | 400 | sans |
| `text-small` | 14px | 1.5 | 0 | 400 | sans |
| `text-label` | 12 → 13px | 1.4 | 0.08em | 400 | mono |

`mono-label` bundles `font-mono text-label uppercase`. Use it for every label: section labels, field labels, status text, terminal titles. The body default is `font-sans text-body text-copy` on `bg-base`. Headings wrap and hyphenate long words, so nothing scrolls sideways at 320px.

### Spacing, radius, and shadow

| Utility | Value | Use |
|---|---|---|
| `max-w-content` | 1280px | outer content width, gutters included |
| `max-w-prose` | 640px | body text measure |
| `px-gutter` | 24 → 48px | side gutters |
| `py-section` | 96 → 192px | vertical padding per section |
| `scroll-mt-anchor` | 96px | anchor offset under the nav (feature 4 sets the real nav height) |
| `--spacing-fade` | 200px | void to base fade at the foot of a void section |
| `--spacing-dot` | 24px | dot texture grid pitch |
| `rounded-chip` | 6px | chips (Geist small material) |
| `rounded-control` | 12px | buttons, fields (Geist medium material) |
| `rounded-card` | 24px | cards; inner controls at 12px sit inside 12px of padding or more |
| `rounded-full` | full | dots only |
| `shadow-control` | three soft black layers | buttons only; the primary adds a 1px white inset highlight on top |

Tailwind's default `--spacing` scale and breakpoints stay as they are.

## Surfaces and texture

- `body` and every `Section` use `texture-dots`: 2px soft `dot` dots on a 24px grid, under a wide radial wash of the section's own tone, so the dots fade out toward the center of each section and most text sits on few or no dots. Text that lands on a dot still passes (the `dot` contrast row).
- `Section tone="void"` paints `void` and fades into `base` over its last 200px. The bottom row is exactly `base`, so the seam is invisible. Only the hero uses it.
- Cards, fields, and chips cover the texture with their solid fill. The dot grid may shift phase at a section seam (accepted).
- Paint order inside a section, bottom to top: texture, void fade, glows (`decor`), content (`relative z-10`). `Section` is `isolate` and `overflow-clip`.
- Forced colors mode hides the texture, the fade, and every glow, and gives `Card`, `Button`, and the `TextField` control a 1px `CanvasText` border.

## Glows

`Glow` is soft radial light, gradients only (never CSS `filter`), with its 45% strength baked into the gradient colors.

- **Where:** only in a `Section`'s `decor` slot, so it is always behind the content and clipped by the section. Never above text.
- **How many:** at most two per viewport on real pages. Large gradients cost paint time on low end phones.
- **Hue:** `violet`, `blue`, `cyan`, or `violet-blue` (two lights in one box).
- **Position:** `top`, `bottom`, a corner, or `center`. The box center sits on that edge, half outside the section.
- **Size:** `sm` `min(24rem, 70vw)`, `md` `min(40rem, 90vw)`, `lg` `min(64rem, 120vw)`. The section clips it, so it never scrolls sideways.
- **Reveal:** by default it fades in once (1200ms) when it enters the viewport, then stays still. The hero, which is in the first viewport, uses `reveal={false}` so it is there from the first paint.
- **Never:** wrap a `Glow`'s ancestor in `Reveal` (an animating ancestor repaints the large gradient every frame), loop it, or animate it after its one fade.

Hover halos are the other use of glow color: `Card glow` (24px past the edge) and the primary `Button` (16px) fade a 30% `glow-violet` halo in behind the surface on hover and, for cards, on focus within.

## Motion

Motion values live in [`src/lib/motion.ts`](../src/lib/motion.ts) (milliseconds; convert with `toSeconds`). The CSS mirror (`--ease-out-strong`, `--duration-fast`, `--duration-roll`, `--duration-reveal`, `--duration-glow`, `--duration-pulse`, `--stagger-letters`) is kept in sync by `src/lib/motion.test.ts`.

| What | Value |
|---|---|
| Easing (everything) | `cubic-bezier(0.23, 1, 0.32, 1)` |
| Block reveal | 600ms, fade + rise 16px, once |
| Group stagger | 60ms per item |
| Word reveal | 600ms per word, rise 0.3em, 40ms apart |
| Letter roll (links) | 250ms per letter, 10ms apart |
| Glow fade | 1200ms, once (CSS transition, not Motion) |
| Hover halos | 600ms fade |
| Button | 150ms: lift 1px on hover, scale 0.97 on press, arrow nudges 2px up and right |
| Color changes, field focus | 150ms |
| Status halo | 2400ms loop, scale 1 → 2.5, opacity 0.6 → 0 |

**Trigger:** a reveal (and a revealing glow) runs the first time any part of it is 10% of the viewport height inside the bottom edge. It never replays.

**Only `opacity` and `transform` animate** in reveals and glow fades, so they never shift layout. Glow positions use the CSS `translate` property, never `transform`.

**Hover only on hover capable pointers.** Tailwind's `hover:` already sits inside `@media (hover: hover)`.

**Reduced motion:** reveals and glow fades become a 150ms opacity fade with no movement and no stagger; `RevealWords` fades the whole heading as one block; the letter roll is off; the status halo is hidden, leaving a static dot; the button does not lift, scale, or nudge its arrow; hover halos appear without a transition; smooth anchor scrolling is off. The setting only changes transitions, never markup.

**No JavaScript:** a `<noscript>` style in the root layout forces every `[data-reveal]` element (revealing glows included) visible and in place. Every element hidden on load must carry `data-reveal`. Hover halos need none.

**Where reveals go:**
- Use them on blocks below the first viewport: a paragraph, a grid of cards (`RevealGroup` + `RevealItem`), a section heading (`RevealWords`).
- Never on anything visible in the first viewport on load (the hero owns its own entrance, feature 4), so the largest paint never waits for JavaScript.
- Never wrap a whole section. Wrap its blocks.
- The letter roll is for short link labels only (one span per letter), never body text and never buttons.
- Motion code only in client components, only through `m.*` inside `MotionProvider` (`LazyMotion strict` throws on a full `motion.*` component).

## Usage rules

- **Violet** marks what you can act on: links (`violet`, `violet-hover` on hover), the focus ring, the caret, the field focus border, selection, and the primary button arrow.
- **Focus:** every link and button shows a 2px `violet` outline with a 3px offset on `:focus-visible` only, following the element's corners. Text fields use a 2px offset and also turn their border violet. A mouse click never shows the ring.
- **Green** is only the status dot and its halo. **Red** is only a field error border and its `ERR //` message.
- **Selection:** `violet` background, `ink` text.
- **Primary button** is the one focal action per view (hero, connect form submit). Use `secondary` for everything else.

## Primitives

All in `src/components/ui/`, named exports, one file each with a colocated test.

| Primitive | Kind | Props | Notes |
|---|---|---|---|
| `Container` | server | `children`, `className?` | `max-w-content`, `px-gutter`, centered |
| `Section` | server | `id` (req), `labelledBy?`, `tone?: "base" \| "void"` (default `base`), `decor?: ReactNode`, `children` | anchor target, `py-section`, `scroll-mt-anchor`, texture, isolated and clipped; `decor` (glows) behind the content |
| `Heading` | server | `level: 1 \| 2 \| 3` (req), `size?: "display" \| "h1" \| "h2" \| "h3"`, `id?`, `className?` | `heading` color; size defaults to the level |
| `Text` | server | `size?: "lg" \| "base" \| "sm"`, `tone?: "body" \| "muted" \| "strong"`, `as?: "p" \| "span" \| "li"`, `className?` | `copy`, `muted`, or `heading` |
| `SectionLabel` | server | `index: number` (1 to 99), `children: string` | `01 // SERVICES` in `mono-label`, `muted` |
| `Divider` | server | `className?` | 1px `hairline` fading at both ends, hidden from assistive tech |
| `SplitLetters` | shared | `children: string`, `labelId?` | `sr-only` label + `aria-hidden` per letter copy; used by `ActionLink` only |
| `ActionLink` | server | `href` (req), `children: string` (req), `arrow?`, `external?` | `violet`, `violet-hover` on hover, letter roll; external opens a new tab with `rel="noopener noreferrer"` |
| `Button` | client | `children: string` (req), `variant?: "primary" \| "secondary"`, `pending?`, `pendingLabel?`, `arrow?`, `type?` (default `"button"`), `className?` (on the wrapper), other Base UI button props | at least 48px tall; primary is `button` fill, `ink` text, `violet-deep` arrow, hover halo; secondary is `raised` with a `field-line` border. Pending shows `pendingLabel`, keeps its colors, stays focusable, `aria-disabled`, ignores click and Enter. Disabled is `muted` on `raised`, no motion, no opacity change |
| `ArrowUpRight` | server | `className?` | 16px decorative SVG, internal to `Button` |
| `TextField` | client | `name` (req), `label` (req), `multiline?`, `error?`, `description?`, input props (never `placeholder`) | `mono-label` label, `raised` fill, `control` radius, `field-line` border, `violet` caret and focus border; error sets a `red` border, `aria-invalid`, and an `ERR //` message linked by `aria-describedby` |
| `StatusIndicator` | server | `children: string` | 8px `green` dot with a pulsing halo, text in `mono-label` `muted`; meaning lives in the text |
| `Card` | server | `children`, `as?: "div" \| "article" \| "li"`, `glow?`, `className?` | `raised`, 1px `border`, `card` radius, `p-6 sm:p-8`, no shadow; `glow` adds the hover and focus within halo |
| `TerminalCard` | server | `title: string` (req), `children` | `Card` with three decorative dots and a `mono-label` title over a mono `copy` body that keeps line breaks |
| `Chip` | server | `children: string` | Geist Mono `text-label` (not uppercase), `copy` on `overlay`, `chip` radius |
| `Glow` | client | `hue` (req), `position` (req), `size?` (default `md`), `reveal?` (default `true`) | see *Glows* |
| `MotionProvider` | client | `children` | wraps the app in the root layout |
| `Reveal` | client | `children`, `as?: "div" \| "p" \| "li"`, `delay?` (ms), `className?` | fade + rise once |
| `RevealGroup` | client | `children`, `as?: "div" \| "ul" \| "ol"`, `className?` | staggers its `RevealItem` children by 60ms |
| `RevealItem` | client | `children`, `as?: "div" \| "li" \| "p"`, `className?` | must sit inside a `RevealGroup` |
| `RevealWords` | client | `text` (req), `level` (req), `size?`, `id?` | heading revealed word by word, announced once |

Who uses what next: feature 4 (hero) uses `Section tone="void"` with `Glow reveal={false}`; feature 5 builds its form from `TextField` and a primary `Button`; feature 6 uses `Card glow`; feature 7 uses `TerminalCard` and `Chip`; feature 8 uses `Card` or `Divider` rows.

## Pinned versions

| Package | Version |
|---|---|
| `motion` | 14.1.0 |
| `@base-ui/react` | 1.9.0 |
| `geist` | 1.7.2 |
| `class-variance-authority` | 0.7.1 |
| `clsx` | 2.1.1 |

Base UI agent skills still import from the deprecated `@base-ui-components/react`. Import from `@base-ui/react`.
