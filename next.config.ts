import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * cacheComponents + partialPrefetching (the create-next-app defaults) were
   * removed on 2026-11-19: every authenticated route reads the session cookie
   * and SQLite per request, and under PPR a raw `cookies()` read inside the
   * layout's Suspense threw DYNAMIC_SERVER_USAGE (HTTP 500 on every logged-in
   * page — reproduced with the bisect probes recorded in the task ledger).
   * Classic mode renders this fully-dynamic admin app the straightforward way;
   * static assets and login/tarifas pages still prerender normally.
   * See node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md.
   */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
