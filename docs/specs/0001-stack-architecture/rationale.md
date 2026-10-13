# 0001. Stack & architecture: rationale

Decision record for [index.md](index.md). `/develop` builds from `index.md`; this file explains why.

## Context

Atticus needs a single page marketing site: six sections (hero, services, infrastructure with a simulated terminal log, portfolio, connect, footer), plus Terms and Privacy pages later. The page's job is to signal premium engineering quality and turn visits into project inquiries delivered to an inbox. The visual brief is stark and minimal (pure black, white type, one amber accent), with smooth scroll transitions, so polish in motion and typography matters more than features.

The forces at play: one developer, no deadline, a Beta workflow (each feature verified on the real app and tested), and a Tracer Bullet build approach (the first slice is the hero deployed to a live URL, proving the whole pipe works). The site must rank and share well (SEO and social cards are planned), meet WCAG AA, and later carry consent aware analytics. The only server side behavior is the contact form; nothing needs to be stored, and there are no user accounts. The engineer already decided on Next.js.

Not deciding now means every later feature would invent its own rendering, styling, and motion conventions, and the first slice could not be deployed. The cost of a wrong call here is moderate: the page is small, but rendering mode, styling system, and host shape every section built after it.

## Options considered

### Option 1: Prerendered Next.js on Vercel (chosen)

Next.js 16 App Router, prerendered under Cache Components with an `ensureStatic` build guard, Tailwind v4, Motion, a Server Action for the form, hosted on Vercel and deployed from GitHub (basis: Next.js 16.4 release notes, Cache Components and `ensureStatic`).

**Pros**:
- Static HTML speed and SEO with a real server function for the form, in one codebase.
- Every Next.js feature works on Vercel with no adapter; preview deploys per branch.
- The build guard makes "the page stayed static" a checked fact, not a hope.

**Cons**:
- Ties the smoothest path to Vercel.
- Relies on recent 16.x APIs that may shift before Next.js 17.

### Option 2: Full static export (`output: 'export'`) on any static host

Next.js builds plain files with no server; the form posts from the browser to a third party form endpoint service.

**Pros**:
- Hostable anywhere (any CDN or bucket), zero server runtime.
- Simplest possible operations.

**Cons**:
- No Server Actions, no `next/image` optimization without extra setup, and the form depends on a third party endpoint whose key or ID is exposed to the browser, which makes spam control weaker.
- Adding any server behavior later (for example, a stored inquiry history) means changing the architecture.

### Option 3: Server rendered Next.js per request

Every visit renders the page on the server.

**Pros**:
- Maximum flexibility if content ever becomes personalized or live.

**Cons**:
- Slower first byte and higher cost for a page whose content changes only when you deploy.
- Nothing on this page needs it; it is the premature optimization failure in reverse (paying for capability not used).

### Option 4: Next.js on a different host (Cloudflare through OpenNext, or Netlify)

The same app built for another platform through an adapter.

**Pros**:
- Avoids coupling to Vercel; Cloudflare can be cheaper at very high traffic.

**Cons**:
- Adapters lag behind new Next.js features (Cache Components, `ensureStatic`), which this stack leans on.
- More setup and more ways to break, for traffic a landing page will not reach.

## Rationale

The forces that decide this are: a static content page that must be fast and indexable, exactly one piece of server behavior (the form), a solo developer, and a Tracer Bullet first slice that needs a working deploy on day one. Option 1 is the only one that satisfies all four without extra moving parts: prerendering gives static speed and SEO, the Server Action gives the form a server with secrets kept off the client, and Vercel runs both with no adapter (basis: prefer a managed application platform for a small team). Option 2 is the strongest alternative and would be right if the form did not need server side secrets and spam control; it does. Option 3 pays for dynamism the page never uses, and Option 4 trades away the newest Next.js features for portability the project does not need yet. A cross check (2026-10-13) raised that Cache Components may be more than a fully static page needs; it stays because Next.js now recommends it by default, it becomes the default in Next.js 17, and the `ensureStatic` guard is built around it. If the scaffold finds `ensureStatic` works without it, keeping it is still the cheaper path forward.

Within Option 1, the smaller choices follow the same logic. Tailwind v4 keeps the strict token palette in one CSS file, so the design system feature can enforce "only these colors" (basis: Tailwind v4 CSS first `@theme` configuration). Motion was chosen over plain CSS because the terminal type in sequence and the interruptible nav transitions are much simpler to write declaratively, and over GSAP because the page needs calm, small transitions rather than complex timelines. The installed `animate` and `emil-design-eng` skills also assume Motion's model (basis: installed community skills `animate`, `emil-design-eng`). No database: inquiries are delivered, not stored, and adding storage now would be infrastructure with no requirement behind it (basis: boring technology, add infrastructure for a measured need). The strict security headers go in now because a Content Security Policy is easy on an empty project and painful to retrofit once third party scripts exist (basis: OWASP secure headers practice).

Runner up for each smaller layer, for the record: CSS Modules (styling), CSS plus IntersectionObserver (motion), Route Handler (form path), npm (package manager), Playwright only (testing), MDX (content).

## Landscape check (2026-10-13)

Current versions confirmed during the design conversation: Next.js 16.4 (React 19.3, Cache Components recommended, `ensureStatic` added; a security release was announced for 2026-10-14), Tailwind CSS 4.3 (CSS first `@theme`), Motion 14.1.0 (14.0 major on 2026-10-02, no breaking changes for React), GSAP fully free including commercial use, Node.js 24 LTS (26 scheduled for LTS in October 2026), Vitest 5.0.4, Playwright 1.64. Unverified: whether Turbopack is the stated default in 16.4, and the current pnpm version.

## References

**Project sources** (verifiable, in this repo):
- `docs/scope/scope.md`, feature 1 (Stack & architecture), the build approach (Tracer Bullet), and the Beta workflow
- Installed community skills `animate`, `emil-design-eng`, `pick-ui-library` (`emilkowalski/skills`)

**Practices & standards**:
- Prefer a managed application platform for a small team
- Boring technology; add infrastructure only for a measured need
- OWASP secure headers practice (CSP, HSTS, frame blocking)
- Progressive enhancement for forms

**Links** (web verified during the design conversation):
- Next.js 16.4 release notes: https://nextjs.org/blog/next-16-4
- Tailwind CSS theme variables (v4.3 docs): https://tailwindcss.com/docs/theme
- Tailwind CSS v4.3 announcement: https://tailwindcss.com/blog/tailwindcss-v4-3
- Motion changelog: https://motion.dev/changelog?lib=motion
- Node.js release schedule: https://nodejs.org/en/about/previous-releases
- Vitest releases: https://github.com/vitest-dev/vitest/releases
- Playwright release notes: https://playwright.dev/docs/release-notes
