import { Suspense, type ReactNode } from "react";
import { StudentBilling } from "@/components/billing/student-billing";

/**
 * `/facturacion` — Design 3, screen 04 (S4). Role-aware exactly like `/`
 * (route mapping IA call 1): the student screen by default, the admin revenue
 * dashboard with `?rol=administracion` (S6/T5 plugs it into the map below),
 * and `?rol=profesor` falling back to the student screen, mirroring the home's
 * fallback.
 *
 * The role lives in `searchParams`, which Next 16 refuses to read outside a
 * Suspense boundary during prerender — same streamed-child pattern as the
 * home and calendar pages.
 */
export default function BillingPage({
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
    // T5 (S6) registers the admin dashboard here:
    // administracion: <AdminRevenue />,
  };

  return screen[rol ?? "alumno"] ?? <StudentBilling />;
}
