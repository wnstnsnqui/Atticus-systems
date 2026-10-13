<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Atticus

Single page marketing site for the Atticus software agency. Prerendered at build time; the contact form Server Action is the only dynamic surface.

## Stack

- **Language / Runtime**: TypeScript 5.9 (`strict` + `noUncheckedIndexedAccess`), Node 24 LTS (`.nvmrc`, `engines`)
- **Framework**: Next.js 16.4 App Router, React 19.3, Turbopack, `cacheComponents: true`, home route exports `ensureStatic`
- **Key dependencies**: Tailwind CSS v4 (tokens via `@theme` in `src/app/globals.css`), Motion for React (feature 3), zod (env + form schema), Vitest 5 + Testing Library, Playwright 1.64 + axe
- **Package manager**: pnpm 11 (exact versions pinned, `saveExact: true`)
- **Hosting**: Vercel, previews per branch/PR, `main` deploys production. No database, no auth.
- Source of truth: [docs/specs/0001-stack-architecture](docs/specs/0001-stack-architecture/index.md)

## Build approach

**Tracer Bullet**: prove one real thread end to end, from scaffold to a deployed page, then thicken it one section at a time.

## Commands

```bash
pnpm install                 # needs Node 24 (nvm use) and corepack
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL is required, the build fails without it
pnpm dev                     # http://localhost:3000
pnpm build
pnpm typecheck               # next typegen && tsc --noEmit
pnpm test                    # Vitest unit/component tests
pnpm test:e2e                # Playwright + axe
```

## Specs

Stored in `docs/specs/`. Format: `docs/specs/NNNN-title/index.md`. Scope lives in `docs/scope/scope.md`.

## Rules

- Functional style: pure functions and immutable data (`const`, `readonly`), side effects only at the edges (Server Actions, `src/lib/env.ts`). No classes where a function works; module level values are constants only.
- Expected failures return typed results, never throw: Server Actions return a discriminated union like `{ ok: true } | { ok: false, errors }`. Throw only for real bugs (caught by `error.tsx`).
- Named exports only. Default exports only where Next.js requires them (`page`, `layout`, `error`, `not-found`, `next.config.ts`).
- Layout is `src/` by role: `app/` routes, `components/sections/<section>/`, `components/ui/` primitives, `content/` typed data (one file per section), `lib/actions/` Server Actions. Import via `@/`.
- Keep the page static: never read `headers()`, `cookies()` or other request APIs while rendering. The `ensureStatic` guard must keep passing.
- Validate env vars in `src/lib/env.ts` (zod) and read them through `env`, never `process.env` directly. Add new vars to `.env.example`.
- Any new third party origin must be added to the CSP in `next.config.ts`, in the spec of the feature that adds it.
- Accessibility baseline on all UI: WCAG AA contrast on black, full keyboard use, visible amber focus, every animation respects `prefers-reduced-motion`.
- Design is fixed by scope: pure black, white headings, `#888888` body, amber `#FFB000` only for interactive and status elements, no gradients or boxes.
- Testing gate: every feature ships Vitest tests beside the source (`*.test.ts(x)`) and Playwright specs in `e2e/` (`*.spec.ts`) with an axe scan.

## Tooling

Chosen here, installed by `/develop tooling`:
- Lint + format: ESLint (Next.js flat config) + Prettier with the Tailwind class sorting plugin
- Pre-commit: lint + format + typecheck on staged files (git hook)
- CI: GitHub Actions on push and PRs running lint, typecheck, unit tests, build, and Playwright e2e

## Git

- integration: on
- branch prefix: feat/
- commit: per-milestone

## Agent skills

- [next-cache-components-adoption](.agents/skills/next-cache-components-adoption/): `vercel/next.js`, Cache Components flag and blocking routes
- [next-cache-components-optimizer](.agents/skills/next-cache-components-optimizer/): `vercel/next.js`, static shell and instant navigation
- [next-dev-loop](.agents/skills/next-dev-loop/): `vercel/next.js`, verify runtime behavior in a running `next dev`
- [vercel-react-best-practices](.agents/skills/vercel-react-best-practices/): `vercel-labs/agent-skills`, React and Next.js performance
- [vercel-react-view-transitions](.agents/skills/vercel-react-view-transitions/): `vercel-labs/agent-skills`, route change transitions only
- [deploy-to-vercel](.agents/skills/deploy-to-vercel/): `vercel-labs/agent-skills`, preview and production deploys
- [tailwind-4-docs](.agents/skills/tailwind-4-docs/): `lombiq/tailwind-agent-skills`, Tailwind v4 utilities and config
- [tailwind-design-system](.agents/skills/tailwind-design-system/): `wshobson/agents`, tokens and component patterns
- [framer-motion-animator](.agents/skills/framer-motion-animator/): `patricio0312rev/skills`, Motion for React animations
- [animate](.agents/skills/animate/): `emilkowalski/skills`, building new motion
- [emil-design-eng](.agents/skills/emil-design-eng/): `emilkowalski/skills`, UI polish and component details
- [pick-ui-library](.agents/skills/pick-ui-library/): `emilkowalski/skills`, UI library choice (feature 3)
- [apple-design](.agents/skills/apple-design/): `emilkowalski/skills`, physical motion, typography, restraint
- [improve-animations](.agents/skills/improve-animations/): `emilkowalski/skills`, motion audit and fix plans
- [find-animation-opportunities](.agents/skills/find-animation-opportunities/): `emilkowalski/skills`, where motion should and should not go
- [vitest](.agents/skills/vitest/): `antfu/skills`, unit and component tests
- [playwright-best-practices](.agents/skills/playwright-best-practices/): `currents-dev/playwright-best-practices-skill`, e2e and a11y tests
- [webapp-testing](.agents/skills/webapp-testing/): `anthropics/skills`, driving the local app with Playwright

MCP servers: next-devtools (recommended), playwright (recommended)
Declined: Vercel MCP, design-motion-principles, framer-motion, motion-framer

## Context files

<!-- Nested AGENTS.md files are listed here as they are created -->

_Drafted by /audit from the repo, worth a quick human pass. Edit freely: once a line stops matching this draft, later runs treat it as curated and will flag rather than overwrite it._
