# 0001. Adopt a prerendered Next.js stack on Vercel for the Atticus landing page

**Date**: 2026-10-13
**Status**: In Progress

## Summary

The Atticus landing page will be built with Next.js 16 (App Router) in strict TypeScript, styled with Tailwind CSS v4, animated with Motion, and hosted on Vercel. The page is prerendered (built once into static HTML at deploy time), and the build fails if anything accidentally makes it dynamic. Only the contact form runs on the server, through a Server Action (a server function the form posts to directly). This keeps the page fast and cheap to run, and good for search engines, while still letting inquiries reach your inbox.

## Requirements

Decision only spec (a foundation stack choice): no feature acceptance criteria and no implementation build plan here. The scaffold work that executes this decision is derived by `/develop stack & architecture` from `## Proposed stack` below. The scope row's definition of done applies to that scaffold: the empty project boots locally, builds clean, and deploys to a Vercel preview URL.

## Decision

**Chosen option**: Option 1: Prerendered Next.js on Vercel (a single app, no database).

Build one Next.js 16 App Router app in strict TypeScript, prerender the home page under Cache Components with an `ensureStatic` build guard, style with Tailwind v4 tokens, animate with Motion for React, handle the contact form with a Server Action, and deploy from GitHub to Vercel.

**Implementation skills**: `next-cache-components-adoption` (`vercel/next.js`, `.claude/skills/next-cache-components-adoption/`) · `next-cache-components-optimizer` (`vercel/next.js`, `.claude/skills/next-cache-components-optimizer/`) · `next-dev-loop` (`vercel/next.js`, `.claude/skills/next-dev-loop/`) · `vercel-react-best-practices` (`vercel-labs/agent-skills`, `.claude/skills/vercel-react-best-practices/`) · `vercel-react-view-transitions` (`vercel-labs/agent-skills`, `.claude/skills/vercel-react-view-transitions/`) · `deploy-to-vercel` (`vercel-labs/agent-skills`, `.claude/skills/deploy-to-vercel/`) · `tailwind-4-docs` (`lombiq/tailwind-agent-skills`, `.claude/skills/tailwind-4-docs/`) · `tailwind-design-system` (`wshobson/agents`, `.claude/skills/tailwind-design-system/`) · `framer-motion-animator` (`patricio0312rev/skills`, `.claude/skills/framer-motion-animator/`) · `animate` (`emilkowalski/skills`, `.claude/skills/animate/`) · `emil-design-eng` (`emilkowalski/skills`, `.claude/skills/emil-design-eng/`) · `pick-ui-library` (`emilkowalski/skills`, `.claude/skills/pick-ui-library/`) · `vitest` (`antfu/skills`, `.claude/skills/vitest/`) · `playwright-best-practices` (`currents-dev/playwright-best-practices-skill`, `.claude/skills/playwright-best-practices/`) · `webapp-testing` (`anthropics/skills`, `.claude/skills/webapp-testing/`)

**MCP servers** (you connect these yourself; the agent uses them once connected): Next.js devtools (`claude mcp add next-devtools -- npx -y next-devtools-mcp`) · Playwright (`claude mcp add playwright -- npx @playwright/mcp@latest`). Vercel MCP was offered and not chosen.

## Rationale

Reasoning and options: see [rationale.md](rationale.md).

## Proposed stack

| Layer | Choice | Reason |
|---|---|---|
| Architecture pattern | One Next.js app (a monolith), no separate backend | One page and one form; anything more is infrastructure with nothing to do. |
| Runtime | Node.js 24 LTS (pin in `.nvmrc` and `package.json` `engines`) | The current long term support line; move to 26 once it is promoted to LTS. |
| Package manager | pnpm (pin with `packageManager` in `package.json`) | Fast, strict about undeclared dependencies, supported natively by Vercel. |
| Language | TypeScript, `strict: true` plus `noUncheckedIndexedAccess` | Catches content shape and form bugs at build time, not in front of a client. |
| Framework | Next.js 16.4+ (latest patched 16.x), App Router, React 19.3 | Your stated choice; the App Router is the current path and ships stable View Transitions. |
| Bundler | Turbopack for dev and build | The current Next 16 path, fastest feedback; nothing in this stack needs Webpack. |
| Rendering | Prerendered at build time; `cacheComponents: true` in `next.config.ts`; home route exports `ensureStatic` | Static HTML is the fastest and cheapest option, ideal for SEO, and the build guard stops accidental dynamic rendering. |
| Server logic | One Server Action in `src/lib/actions/contact.ts` (`"use server"`), validated by one shared zod schema in `src/lib/contact/schema.ts` (used by both the browser and the server). The form posts natively (works with no JavaScript) and is enhanced with `useActionState` for inline errors. The action is the only dynamic surface: no request APIs (`headers()`, `cookies()`) are read while the page renders | Keeps secrets on the server, no separate API to maintain, and the page stays static. The email provider, spam protection, and failed send logging are decided in the feature 5 spec. |
| Styling | Tailwind CSS v4, tokens defined CSS first with `@theme` in `src/app/globals.css` | One source for black, white, `#888888`, amber, the type scale, and spacing; no runtime cost. Exact token values come from the design system spec (feature 3). |
| Animation | Motion for React (`motion` v14), loaded through `LazyMotion` + `m` components, owns all motion within the page. React View Transitions are allowed only for route changes (for example home to `/terms`), never for in page motion | Declarative in view reveals, springs, and interruptible transitions with reduced motion support built in. One system per job avoids two competing animation stacks. |
| Smooth scrolling | Native CSS: `scroll-behavior: smooth` on `html` plus `scroll-margin-top` on section anchors, switched off under `prefers-reduced-motion`. No scroll library | Zero JavaScript, keeps native scrolling and accessibility intact. |
| UI component library | Decided in the design system spec (feature 3) using `pick-ui-library` | It is a design decision, not a stack one; must be compatible with Tailwind v4 and React 19. |
| Fonts | `next/font` (self hosted, preloaded) | No runtime request to a font CDN (better privacy and speed), and no layout shift. The typeface itself is chosen in feature 3. |
| Images | `next/image` | Real project screenshots get resized and lazy loaded automatically when they replace the placeholders. |
| Content | Typed TypeScript data files in `src/content/` (one per section) | Short lists (services, stack labels, projects, log lines) are type checked, and swapping a project is a one file edit. No CMS to run. |
| Primary database | None | Nothing is stored: inquiries go straight to your inbox. Revisit only if you later want a stored inquiry history. |
| Auth | None | Public marketing page, no accounts. |
| Environment config | `src/lib/env.ts` validates variables with a zod schema and is imported from `next.config.ts`, so a bad value fails the build. Required now: `NEXT_PUBLIC_SITE_URL` (the canonical origin, used later by metadata, sitemap, and email). Email provider variables are added as optional by the scaffold and become required in feature 5. Commit `.env.example`; secrets live in Vercel project settings, scoped per environment (preview vs production) | A missing key fails loudly at deploy time, instead of the form silently dropping leads. |
| Security headers | Strict baseline in `next.config.ts` `headers()`: a static Content Security Policy with no nonces (nonces force per request rendering and would break `ensureStatic`): `default-src 'self'`, `script-src 'self' 'unsafe-inline'` (Next.js bootstrap scripts), `style-src 'self' 'unsafe-inline'` (`next/font` and Motion inline styles), `img-src 'self' data: blob:`, `font-src 'self'`, `connect-src 'self'`, `form-action 'self'`, `base-uri 'self'`, `object-src 'none'`; plus HSTS, `X-Frame-Options: DENY` (plus `frame-ancestors 'none'`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, a restrictive `Permissions-Policy` | Cheap now and painful to add later. Each later feature (spam protection, analytics, error tracking) extends the CSP allowlist in its own spec. `'unsafe-inline'` for scripts is the accepted cost of a fully static page. |
| Search engine visibility of previews | `X-Robots-Tag: noindex` on every deployment except production (keyed on `VERCEL_ENV`) | Keeps preview URLs out of search results and avoids duplicate content. |
| Hosting | Vercel, Pro plan before production goes live (Hobby is fine for previews), framework preset Next.js, Node 24 set in project settings, default function region | Built by the Next.js team, so Cache Components and `next/image` work with no adapter, with a preview URL for every change. Vercel's Hobby tier does not allow commercial use, and an agency site is commercial. |
| Source control and delivery | Git on GitHub: the scaffold runs `git init` with default branch `main` and pushes to the private repo `github.com/wnstnsnqui/Atticus-systems`, connected to Vercel: every branch or pull request gets a preview deploy, and `main` deploys production | Review on a real URL before anything goes live. CI checks (lint, types, tests) are added later by `/audit` and `/develop tooling`. |
| Unit and component tests | Vitest 5 + Testing Library | Fast feedback on form validation, content shape, and component behavior. |
| Browser tests | Playwright 1.64 + axe accessibility scans | Proves scroll anchors, the form round trip, reduced motion, phone widths, and WCAG AA in a real browser. |
| Observability | Deferred to the feature 11 spec (analytics and error tracking) | Tied to consent (feature 12), so it is chosen there, not guessed here. |

**Folder layout** (`src/` by role):

```
src/
  app/                 routes: layout.tsx, page.tsx, globals.css, later /terms and /privacy
  components/
    sections/          one folder per page section (hero, services, infrastructure, portfolio, connect, footer)
    ui/                shared primitives (from the design system)
  content/             typed data files, one per section
  lib/
    actions/           Server Actions (contact form)
    env.ts             environment variable validation
```

**Scaffold boundary** (what `/develop stack & architecture` installs now versus later): only the runnable skeleton, meaning Next.js, React, TypeScript, Tailwind v4, zod (for `env.ts`), the `src/` layout, the security and noindex headers, `.nvmrc`, exact version pins (`save-exact=true` in `.npmrc`), and the Vercel and GitHub connection. It includes a root `layout.tsx` (`<html lang="en">`, a metadata stub reading `NEXT_PUBLIC_SITE_URL`), `not-found.tsx`, and `error.tsx`, plus `package.json` scripts `dev`, `build`, `start`, and `typecheck`. Its pass condition: `pnpm typecheck` and `pnpm build` succeed, a deliberate dynamic call on the home page makes the build fail (proving `ensureStatic` guards it; then removed), and a blank page is live on a preview URL. Motion, the UI library, fonts, the form provider, and the test tools are installed by the features that first use them (Motion and fonts with feature 3, the email provider with feature 5, Vitest and Playwright when `/test` first runs). Lint, format, and pre-commit come from `/audit` and `/develop tooling` (feature 2).

## Consequences

**Positive**:
- The page ships as static HTML from a global CDN: near instant loads, top Core Web Vitals potential, and nearly zero hosting cost on the free tier.
- One codebase and one deploy target; a solo developer can run all of it.
- The `ensureStatic` guard and the env schema turn two quiet failure modes (an accidentally dynamic page, a missing email key) into loud build failures.
- Every change gets a reviewable preview URL before production.

**Negative / tradeoffs**:
- Coupled to Vercel for the smoothest path. Server Actions run on any Node host, so moving is possible, but the newest Next.js features (Cache Components, `ensureStatic`) may lag on other hosts' adapters.
- The CSP allows inline scripts (`'unsafe-inline'`) because nonces would make the page dynamic; the rest of the policy still blocks third party scripts, frames, and form targets.
- Vercel Pro costs about $20 a month once the site is live commercially.
- Cache Components and `ensureStatic` are recent (16.x) features; their APIs may still shift before Next.js 17, so expect small config churn on upgrades.
- Motion adds roughly 30 to 40 KB of JavaScript (less with `LazyMotion`) to a page that could in theory run on CSS alone.
- A strict CSP must be extended every time a third party script is added (analytics, error tracking), which is extra work in features 11 and 12.
- No database means no record of inquiries outside your inbox; if an email fails to send, the visitor sees an error but nothing is stored to retry from.

**Neutral**:
- Fixed versions move fast in this space: pin exact versions in the lockfile and upgrade on purpose.
- Tool choices for email delivery, analytics, error tracking, and the UI library are deliberately left to their own feature specs.

## Follow-up

- [ ] Next.js announced an out of band security release planned for 2026-10-14; at scaffold time, check it shipped and use the patched 16.x version.
- [ ] Feature 5 owns spam protection (and any CSP additions it needs), Server Action origin checks (keep the default), and logging failed sends (plus a fallback contact path in the error state).
- [ ] Feature 13 owns the production domain, apex vs `www` redirect, and DNS; feature 5 owns the email sending domain records (SPF, DKIM).
- [ ] Confirm whether Node.js 26 has been promoted to LTS at scaffold time; if so, pin 26 instead of 24.
- [ ] Root `AGENTS.md` does not exist yet; `/audit` should capture this stack, the build approach (Tracer Bullet), the folder layout, and the `## Agent skills` section. Project wide skills go at root (the Next.js, React, Tailwind, Vercel, and design skills); testing skills (`vitest`, `playwright-best-practices`, `webapp-testing`) fit a nested tests area doc once one exists. Record the `MCP servers:` line (Next.js devtools, Playwright) and `Declined:` Vercel MCP, plus the Motion skills considered and skipped (`design-motion-principles`, `framer-motion`, `motion-framer`).
- [ ] Connect the two chosen MCP servers yourself (commands under `## Decision`).
- [ ] The scope header says `pick-ui-library` is not installed; it now is. Run `/scope` (replan) or `/sync` to refresh that line.
