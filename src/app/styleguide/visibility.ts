import type { env } from "@/lib/env";

// The styleguide ships on previews and locally, never in production.
export const isStyleguideEnabled = (vercelEnv: (typeof env)["VERCEL_ENV"]): boolean =>
  vercelEnv !== "production";
