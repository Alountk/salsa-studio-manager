import { Suspense } from "react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { requireUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Estudio Salsa — Gestión de clases de salsa",
};

/**
 * Authoritative session gate (spec S4). It reads cookies + SQLite, so under
 * `cacheComponents` it cannot sit in the static shell: it lives behind a
 * Suspense boundary (see docs/authentication-with-cache-components) — the
 * build prerenders only the fallback, and this subtree (including every
 * db-reading page below) renders per request. An invalid session redirects
 * from inside the stream.
 */
async function RequireSession({ children }: { children: ReactNode }) {
  await requireUser();
  return <>{children}</>;
}

/**
 * Route group for the authenticated area. Group segments do not appear in the
 * URL, so `src/app/(app)/page.tsx` still serves `/`.
 *
 * The whole shell sits inside one Suspense: the session gate must run per
 * request, and client shell pieces reading `usePathname` cannot enter the
 * static prerender of dynamic routes such as `[numero]` (cacheComponents
 * rule). The authenticated area therefore ships as a streamed shell — correct
 * for a fully live tool, irrelevant to keep static.
 */
export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <RequireSession>
        <AppShell>{children}</AppShell>
      </RequireSession>
    </Suspense>
  );
}
