# Verify: Design system & motion foundation · spec 0002 · updated 2026-10-13
> ⚠️ Stale: these steps test the first (amber) version. Spec 0002 was revised on 2026-10-13; `/develop` regenerates this file in build plan task 9.

_Steps derived from spec 0002 acceptance criteria. `/check verify` runs these; `/test` locks the durable ones._

## UI / manual
- [ ] Open `/styleguide` on the Vercel preview → page renders in Satoshi and Geist Mono, no console or CSP errors → AC-2, AC-11, AC-13
- [ ] DevTools Network, filter Font → every font request is same origin, none to a third party → AC-2
- [ ] Scroll down `/styleguide` → each type row and color swatch fades and rises once; the "Calm motion…" heading reveals word by word; scrolling back up and down does not replay → AC-4
- [ ] Shrink the window to 120px tall and scroll to the Motion paragraph → it still reveals although taller than the viewport → AC-4
- [ ] Turn on the OS "reduce motion" setting and reload → reveals only fade (no rise, no stagger), the heading fades as one block, hovering "Initialize Pipeline" moves no letter, the status dot is static → AC-5, AC-9
- [ ] Disable JavaScript and reload → every reveal block is visible and in place → AC-6
- [ ] With a mouse, hover "Initialize Pipeline" → letters roll up 10ms apart and roll back on leave; clicking a link or button shows no outline → AC-7
- [ ] Tab through the page → links and buttons show a 2px amber outline offset 4px; the Name field shows a 2px amber underline and no outline ring → AC-7, AC-8
- [ ] With a screen reader, focus "Initialize Pipeline" and the Motion heading → each is read once as whole words, the arrow is not read → AC-4, AC-7
- [ ] Tab to the "Sending…" button and press Enter or click → nothing happens, it stays focused and is announced as dimmed or disabled, text stays full amber → AC-7
- [ ] Look at "Work Email" → 1px amber underline, `ERR // Enter a valid email` below in mono; a screen reader reads "Error: Enter a valid email" as its description → AC-8
- [ ] Let the browser autofill Name or Company Email → background stays black, text white → AC-8
- [ ] Look at "Pipeline Active // 2026" → 8px amber dot with a halo pulsing every 2.4s → AC-9
- [ ] Look at "04 // Connect" → reads `04 // CONNECT` in gray mono with wide tracking → AC-10
- [ ] Select some text → white background, black text → AC-13
- [ ] Resize to 320px wide → no horizontal scroll; "Infrastructure that ships" wraps → AC-3
- [ ] Open `docs/design.md` → covers tokens, type, spacing, motion rules (durations, easing, reduced motion, no JS fallback, where reveals go), usage rules, primitive inventory with props, pinned versions → AC-12

## Value sourcing
- [ ] Change `--color-muted` in `globals.css` to `#666666` and run `pnpm test` → the contrast test fails naming `muted`; revert → AC-1
- [ ] Change `--duration-roll` in `globals.css` to `300ms` and run `pnpm test` → the motion mirror test fails; revert → AC-4
- [ ] `/styleguide` swatches show each hex and ratio read from `globals.css` (amber reads `#FFB000 · 11.46:1`) → AC-11
- [ ] Reveal timing comes from `src/lib/motion.ts`: in DevTools, a reveal takes about 600ms with no delay → AC-4
- [ ] Letter roll delay comes from `--i` per span: inspect a letter, `--i` matches its index → AC-7
- [ ] Reduced motion comes from the OS setting only; markup is identical with it on or off (compare the page HTML) → AC-5
- [ ] The `TextField` error text comes from the `error` prop only, rendered as text (an `<img>` string shows as text) → AC-8
- [ ] The `Button` pending label comes from `pendingLabel`, falling back to the label → AC-7
- [ ] `/styleguide` visibility comes from `VERCEL_ENV` at build: 200 on a preview, 404 on production → AC-11
- [ ] Satoshi comes from `src/app/fonts/Satoshi-Variable.woff2` with its licence beside it; Geist Mono from the pinned `geist` package → AC-2
- [ ] Section scroll margin comes from `--spacing-anchor` (6rem): click a styleguide nav link, the section lands 96px below the top → AC-3

## Commands
- [ ] `pnpm test` → all unit tests pass, including contrast, motion mirror, and every primitive → AC-1, AC-4, AC-5, AC-7, AC-8, AC-10
- [ ] `pnpm test:e2e` → `e2e/design-system.spec.ts` and the scaffold suite pass, axe reports zero violations → AC-2 to AC-9, AC-11, AC-13
- [ ] `pnpm build` → `/` and `/styleguide` both prerender as static (`○`) with `ensureStatic` → AC-11, AC-13
- [ ] `VERCEL_ENV=production pnpm build && node scripts/check-styleguide-gate.mjs` → prints that `/styleguide` returned 404 → AC-11
- [ ] CI on the PR → the "Styleguide is hidden in production builds" step passes → AC-11

## Acceptance-criteria coverage
- AC-1: value sourcing contrast step, `pnpm test` · AC-2: preview render, network fonts, e2e · AC-3: 320px step, anchor step · AC-4: scroll steps, screen reader step, mirror step · AC-5: reduced motion step, markup step · AC-6: no JavaScript step · AC-7: hover, keyboard, screen reader, pending steps · AC-8: field steps, autofill · AC-9: status step · AC-10: section label step · AC-11: swatches, gate command, CI, build · AC-12: design.md step · AC-13: selection step, console and CSP step, build
