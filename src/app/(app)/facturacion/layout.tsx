import { BillingTabs } from "@/components/billing/billing-tabs";
import type { ReactNode } from "react";

/**
 * Billing area shell: the Facturas/Cuotas tabs over the page content (billing
 * simplification, spec S3/S6).
 */
export default function FacturacionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-6">
      <BillingTabs />
      {children}
    </div>
  );
}
