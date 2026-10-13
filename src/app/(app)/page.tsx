import { Suspense, type ReactNode } from "react";
import { AdminHome } from "@/components/home/admin-home";
import { StudentHome } from "@/components/home/student-home";
import { TeacherHome } from "@/components/home/teacher-home";

/**
 * Design 1, screens 04/05/06 — the three role-aware homes.
 *
 * Real role routing needs an auth session, which this feature does not build
 * (see non-goals). Until then the login's demo selector sets `?rol=` and this
 * page renders the matching designed screen, so all three remain reachable as
 * first-class URLs instead of hiding behind a client-side toggle.
 *
 * The role lives in `searchParams`, which Next 16 refuses to read outside a
 * Suspense boundary during prerender, so the read is isolated in a streamed
 * child and the page shell still prerenders.
 */
export default function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ rol?: string }>;
}) {
  return (
    <Suspense fallback={null}>
      <RoleScreen searchParams={searchParams} />
    </Suspense>
  );
}

async function RoleScreen({
  searchParams,
}: {
  searchParams: Promise<{ rol?: string }>;
}): Promise<ReactNode> {
  const { rol } = await searchParams;

  const screen: Record<string, ReactNode> = {
    profesor: <TeacherHome />,
    administracion: <AdminHome />,
  };

  return screen[rol ?? "alumno"] ?? <StudentHome />;
}
