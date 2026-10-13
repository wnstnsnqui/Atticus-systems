import type { NextConfig } from "next";
import { env } from "./src/lib/env";

const isDev = process.env.NODE_ENV === "development";

// Static policy with no nonces: nonces force per request rendering, which would
// break ensureStatic on the home page. Later features (spam protection,
// analytics, error tracking) extend these lists in their own specs.
const csp = [
  "default-src 'self'",
  // 'unsafe-inline' covers the Next.js bootstrap scripts; dev also needs eval for HMR.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

// Keep every deployment except production out of search results.
const robotsHeaders =
  env.VERCEL_ENV === "production" ? [] : [{ key: "X-Robots-Tag", value: "noindex" }];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: [...securityHeaders, ...robotsHeaders] }];
  },
};

export default nextConfig;
