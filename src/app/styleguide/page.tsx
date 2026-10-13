import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contrastRatio } from "@/lib/design/contrast";
import { parseColorTokens } from "@/lib/design/tokens";
import { env } from "@/lib/env";
import { isStyleguideEnabled } from "./visibility";

export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "Styleguide · Atticus",
  robots: { index: false, follow: false },
};

// Read at build time while prerendering; the page ships as static HTML.
const colorTokens = () =>
  parseColorTokens(readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8"));

export default function StyleguidePage() {
  if (!isStyleguideEnabled(env.VERCEL_ENV)) notFound();

  return (
    <main className="mx-auto max-w-5xl px-6 py-24">
      <h1 className="text-5xl font-medium text-white">Styleguide</h1>
      <p className="mt-6 max-w-xl">
        The Atticus design system on one page: tokens, type, spacing, and primitives.
      </p>
      <ul className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
        {colorTokens().map(({ name, value }) => (
          <li key={name}>
            <div className="h-20 border border-hairline" style={{ backgroundColor: value }} />
            <p className="mt-3 font-mono text-white">{name}</p>
            <p className="font-mono">
              {value} · {contrastRatio(value, "#000000").toFixed(2)}:1
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
