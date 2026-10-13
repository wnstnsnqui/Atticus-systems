# Verify: Stack & architecture · spec 0001 · updated 2026-10-13
_Steps derived from the spec 0001 scaffold pass condition and the scope's Done when (a decision only spec, so there are no AC IDs). `/check verify` runs these; `/test` locks the durable ones._

## Commands
- [ ] `pnpm typecheck` → exits 0 → pass condition
- [ ] `pnpm build` → exits 0, and the route table shows `○ /` (static) → pass condition
- [ ] Add `await headers()` to `src/app/page.tsx`, run `pnpm build` → fails with "uncached or runtime data on a route that must be fully static"; then revert → `ensureStatic` guard
- [ ] Move `.env.local` aside, run `pnpm build` → fails with "Invalid environment variables" naming `NEXT_PUBLIC_SITE_URL`; then restore → env schema guard
- [ ] `pnpm build && pnpm start`, then `curl -sI localhost:3000/` → 200 with `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `X-Robots-Tag: noindex` → security and noindex headers
- [ ] `curl -s -o /dev/null -w '%{http_code}' localhost:3000/nope` → `404` → `not-found.tsx`
- [ ] `pnpm dev` → `/` returns 200 → boots locally

## UI / manual
- [ ] Open the Vercel preview URL → a blank black page loads, and response headers include `X-Robots-Tag: noindex` → deploys to a preview URL
- [ ] On the production deployment (once it exists), the response has no `X-Robots-Tag` header → noindex is keyed on `VERCEL_ENV`

## Coverage
- Boots locally: `pnpm dev` step · Builds clean: typecheck and build steps · Guards: static and env steps · Headers: curl step · Deploys to preview: Vercel preview step (pending, needs push and Vercel link)
