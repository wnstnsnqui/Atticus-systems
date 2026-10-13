# Scope: Atticus landing page

A single page marketing site for Atticus, a software agency. It speaks to companies that want premium engineering, and turns visits into project inquiries that reach your inbox.

**Build approach:** Tracer Bullet (prove one real thread end to end, from scaffold to a deployed page, then thicken it one section at a time).
**Workflow:** Beta (after `/develop`, run `/check verify`, then `/test`). The project default level of rigor. `/architect` is the recommended first stop for a feature with a real decision, but skippable when you already know the build. Any feature can carry its own tag (e.g. `· GA`) to do more or less.

**Fixed by you (carry into every spec):** built with Next.js. Pure black `#000000` everywhere, no gradients. Headings white `#FFFFFF`, body copy gray `#888888`, Electric Amber `#FFB000` only for interactive elements and status signals. One sharp geometric sans serif. Generous whitespace, no boxes or heavy borders, no colorful graphics. Smooth transitions on scroll. Nav and footer links scroll within the page; Terms and Privacy become real pages. The original page brief (all section copy) is the content source for each `/architect` run. Design skills to apply: `emil-design-eng` and `animate` (installed); `pick-ui-library` is not installed yet, so install it before the design system decision or pick the library inside that spec.

_These are recommendations to keep your build orderly, not requirements. Skip anything that does not fit: if you already know how to build a feature, use `/develop` and skip `/architect`. You decide when a feature is `done`._

## At a glance

| # | Feature | Phase | Status |
|---|---------|-------|--------|
| 1 | Stack & architecture | Foundation | in-progress |
| 2 | Coding standards & tooling | Foundation | planned |
| 3 | Design system & motion foundation | Foundation | planned |
| 4 | Hero & navigation | Slice 1 | planned |
| 5 | Connect section & inquiry delivery | Slice 2 | planned |
| 6 | Services grid | Slice 3 | planned |
| 7 | Infrastructure & terminal log | Slice 3 | planned |
| 8 | Shipped code portfolio | Slice 3 | planned |
| 9 | Command footer | Slice 3 | planned |
| 10 | SEO & social cards | Slice 4 | planned |
| 11 | Analytics & error tracking | Slice 4 | planned |
| 12 | Legal pages & cookie consent | Slice 4 | planned |
| 13 | Launch readiness pass | Slice 4 | planned |

## Foundations

### 1. Stack & architecture · in-progress
Lock in everything around Next.js (rendering mode, styling approach, hosting, project layout) and scaffold a runnable project.
**Done when:** the stack is recorded in a spec, and the empty scaffold boots locally, builds clean, and deploys to a preview URL.
- [x] Decide the stack (spec): `/architect stack & architecture`
- [ ] Scaffold from the decision: `/develop stack & architecture`
- [x] Smoke check it runs: `/test`
Spec [0001](../specs/0001-stack-architecture/index.md) · code in `src/` (plus root config: `next.config.ts`, `package.json`, `tsconfig.json`)

### 2. Coding standards & tooling
Capture conventions, then install lint, format, type strictness, and pre-commit checks from the real scaffolded project.
**Done when:** root `AGENTS.md` reflects the real stack, and lint, format, and pre-commit run clean.
- [ ] Capture conventions + tooling choices: `/audit`

### 3. Design system & motion foundation · needs a decision
The visual language every section depends on: color tokens, the geometric typeface, type and spacing scales, the UI library choice, and one shared scroll reveal pattern with reduced motion support.
**Done when:** `design.md` covers tokens, type, spacing, and motion rules (durations, easing, reduced motion), base primitives exist, and every text color meets WCAG AA contrast on black.
- [ ] Design it (spec): `/architect design system & motion foundation`

## Slice 1: Hero, deployed (the first real thread)

### 4. Hero & navigation · needs a decision
Full screen hero with the lowercase `atticus` wordmark, the one line promise, the minimal nav ([Systems] [Labs] [Studio] [Connect]), and the "Pipeline Active // 2026" indicator. Shipped to a live preview so the whole pipe (scaffold, design system, deploy) is proven.
**Done when:** the hero fills the viewport and stays centered on phone and desktop, the nav works by keyboard and on touch, links scroll smoothly to section anchors, and the page is live on a preview URL.
- [ ] Design it (spec): `/architect hero & navigation`

## Slice 2: Inquiries reach you

### 5. Connect section & inquiry delivery · needs a decision
"04 // CONNECT" with contact details on the left and the thin line form (Name, Company Email, Project Scope Overview, "Initialize Pipeline →") on the right. Submissions really arrive in your inbox.
**Done when:** a valid submission lands in your inbox, invalid fields show clear inline errors, spam is filtered, success and failure states render, and the form works fully by keyboard and screen reader.
- [ ] Design it (spec): `/architect connect section & inquiry delivery`

## Slice 3: The rest of the page

### 6. Services grid
"01 // SERVICES" with the three pillars (atticus core, atticus studio, atticus labs) in a widely spaced three column grid.
**Done when:** three columns on desktop collapse cleanly to one on phones, and the section reveals on scroll using the shared motion pattern.
- [ ] Build it: `/develop services grid`

### 7. Infrastructure & terminal log · needs a decision
"02 // INFRASTRUCTURE" with the plain text tool labels and a simulated pipeline log whose timestamped lines type in once when the section scrolls into view, then rest.
**Done when:** the log plays once on first view, shows complete instantly under reduced motion, never shifts the layout, and screen readers get the full log without being spammed by updates.
- [ ] Design it (spec): `/architect infrastructure & terminal log`

### 8. Shipped code portfolio
"03 // SHIPPED CODE" as wide rows (Project Alpha, Beta, Gamma) with a tech tag and a dark 16:9 placeholder each, driven by one data list.
**Done when:** rows stack cleanly on all widths, placeholders hold a 16:9 ratio without layout shift, and adding or swapping a project means editing only the data list.
- [ ] Build it: `/develop shipped code portfolio`

### 9. Command footer
Muted copyright line, Terms of Engagement and Privacy Protocol links, and the "System Status: Operational" signal.
**Done when:** the footer reads cleanly on phone and desktop, and legal links point to their routes (filled in by feature 12).
- [ ] Build it: `/develop command footer`

## Slice 4: Launch readiness

### 10. SEO & social cards · needs a decision
Metadata, sitemap, structured data for the agency, and a share image so links look right on LinkedIn, X, and Slack.
**Done when:** title, description, and canonical URL are set, sitemap and robots are served, structured data validates, and a shared link shows the branded card.
- [ ] Design it (spec): `/architect SEO & social cards`

### 11. Analytics & error tracking · needs a decision
Count visits and contact form conversions, and catch production errors, only within what visitor consent allows.
**Done when:** a page view and a successful form submission are recorded, a forced error is captured, and nothing that needs consent runs before the visitor gives it.
- [ ] Design it (spec): `/architect analytics & error tracking`

### 12. Legal pages & cookie consent · needs a decision
Real Terms of Engagement and Privacy Protocol pages in the same style, plus a minimal cookie notice that governs the tracking from feature 11.
**Done when:** both pages are live and linked from the footer, the privacy page describes the form and analytics data actually collected, and the visitor's consent choice is respected and remembered.
- [ ] Design it (spec): `/architect legal pages & cookie consent`

### 13. Launch readiness pass
A whole page check before going live on your real domain: accessibility, performance, and cross browser behavior.
**Done when:** the page meets WCAG AA by keyboard and screen reader, Core Web Vitals are in the good range on mobile, and the production domain serves the final build.
- [ ] Check it: `/check verify launch readiness pass`

## Deferred
Out of scope for the current build pass, kept so the plan stays honest.
- **Real case studies**: swap the portfolio placeholders for real projects and screenshots (data list only)
- **Separate Systems, Labs, Studio pages**: if the nav ever outgrows in page anchors · needs a decision

## Legend

**The decision box.** Every feature carries exactly one, the sub-task whose label ends with `(spec)`. Its wording varies (`Design it (spec)` normally, `Decide the stack (spec)` on Stack & architecture), so skills locate it by that `(spec)` suffix, never by an exact label. Every other box is an execution box and `/architect` never ticks one.

**Feature lifecycle**: the scope updates as a feature moves; each row is what it shows and who sets it:

| State | Set by | The feature shows |
|---|---|---|
| `planned` · needs a decision | `/scope` | one box: `Design it (spec): /architect <feature>` |
| `in-progress` (designed) | **`/architect` at spec capture** | `Design it` ticked; spec linked; `Build it: /develop <feature>` + **2 to 5 milestones**; the tier's closing boxes (`Verify it` Alpha+, `Test it` Beta+, `Review it` + `Document it` GA); any surfaced follow-up enrolled |
| `in-progress` (building) | `/develop` | milestone sub-boxes tick one by one; code pointer filled |
| `in-progress` (verified) | `/check verify` | `Build it` + milestones ticked; `Verify it` ticked |
| `done` | **you, when you decide it is** (any skill sets it when you say so); `/sync` reconciles | boxes you ran ticked, skipped ones marked skipped; the tier's last stage (`Prototype` → after `/develop`; `Alpha` → after `/check verify`; `Beta`/`GA` → after `/test`) is the suggested point to call it done; `/sync` captures conventions |

- **Next step** = the first unticked box (always a command or a tracked milestone).
- **needs a decision** = run `/architect` first; otherwise straight to `/develop` (or `/audit` for standards & tooling). The tag drops once the spec is captured.
- **Atomic build tasks live in the spec's `## Build plan`, not here**: the scope carries only the milestone rollup.
- **Status** `planned` → `in-progress` → `done`, plus `existing` (pre-workflow) and `dropped` (de-scoped, kept for history).
- **Approach tag** beside a heading (e.g. `· Facade`) overrides the project default for that feature; no tag = inherits it.
- **Workflow tier tag** beside a heading (e.g. `· GA`, `· Prototype`) sets that one feature's rigor above or below the project default; no tag inherits the default. It decides the feature's check boxes and each skill's next suggestion.
- **Workflow** (header line) is the project default, what runs after `/develop`: **Prototype** = nothing (trust develop's own build time self check); **Alpha** = `/check verify`; **Beta** = `/check verify` then `/test`; **GA** = adds a fresh model `/check review` then `/document`. A feature built on an unratified decision (an `Assumed` spec) stays flagged, but that never blocks `done`.
- **Pointer line** (`spec <n> · code in <path>`): the spec link added by `/architect`, the code path by `/develop`.
