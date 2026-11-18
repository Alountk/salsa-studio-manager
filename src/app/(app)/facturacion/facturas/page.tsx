import { redirect } from "next/navigation";

/**
 * Legacy list route: the billing simplification moved the invoice list to
 * `/facturacion` (spec S2/S3). Old links land on the new home instead of a
 * duplicate screen; detail lives at `/facturacion/facturas/[numero]`.
 */
export default function LegacyFacturasIndex() {
  redirect("/facturacion");
}
