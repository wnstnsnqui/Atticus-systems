import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Named exports only (AGENTS.md rules).
  {
    rules: {
      "import/no-default-export": "error",
    },
  },
  // Next.js and tool config files must default export.
  {
    files: [
      "src/app/**/{page,layout,error,not-found,global-error,loading,template,default}.tsx",
      "src/app/**/{robots,sitemap,manifest,opengraph-image,twitter-image,icon,apple-icon}.{ts,tsx}",
      "*.config.{ts,mts,mjs}",
    ],
    rules: {
      "import/no-default-export": "off",
    },
  },
  // Turns off ESLint rules that clash with Prettier. Keep last.
  prettier,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
