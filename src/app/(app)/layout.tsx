import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/shell/app-shell";
import { requireUser } from "@/lib/auth/guards";

export const metadata: Metadata = {
  title: "Estudio Salsa — Gestión de clases de salsa",
};

/**
 * Route group for the authenticated area. Group segments do not appear in the
 * URL, so `src/app/(app)/page.tsx` still serves `/`.
 *
 * `requireUser()` runs directly in the layout (classic rendering, no
 * cacheComponents): reading cookies here marks every route dynamic, an
 * unauthenticated full load gets a clean 307 to `/login` before any HTML is
 * flushed, and no Suspense shell is involved (the PPR attempt with a Suspense
 * hole threw DYNAMIC_SERVER_USAGE — see next.config.ts's note).
 */
export default async function AuthenticatedLayout({ children }: { children: ReactNode }) {
  await requireUser();
  return <AppShell>{children}</AppShell>;
}
