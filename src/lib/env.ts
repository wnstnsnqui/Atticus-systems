import { z } from "zod";

// Validated at build time (imported from next.config.ts), so a bad or missing
// value fails the deploy instead of breaking the live site.
const schema = z.object({
  // Canonical origin, e.g. https://atticus.systems. Used by metadata, sitemap, and email.
  NEXT_PUBLIC_SITE_URL: z.url(),
  // Set by Vercel: "production" | "preview" | "development". Absent locally.
  VERCEL_ENV: z.enum(["production", "preview", "development"]).optional(),
  // Email provider variables are added here by feature 5 (inquiry delivery),
  // once its spec picks the provider.
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", z.prettifyError(parsed.error));
  throw new Error("Invalid environment variables. See .env.example.");
}

export const env = parsed.data;
