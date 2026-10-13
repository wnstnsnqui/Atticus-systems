# Atticus

Marketing site for Atticus. Next.js 16 (App Router), TypeScript, Tailwind CSS v4, deployed on Vercel.
The stack decision lives in [docs/specs/0001-stack-architecture](docs/specs/0001-stack-architecture/index.md).

## Run it

You need Node 24 (`nvm use`) and pnpm (`corepack enable`).

```bash
cp .env.example .env.local
pnpm install
pnpm dev        # http://localhost:3000
pnpm typecheck
pnpm build
```
