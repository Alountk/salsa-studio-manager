import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

/*
 * The two families DESIGN.md §Typography mandates. next/font self-hosts them and
 * exposes CSS variables consumed by the Tailwind theme in globals.css, so the
 * type scale declared there resolves to the right faces.
 */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Estudio Salsa — Gestión de clases de salsa",
  description:
    "Calendario, creación de clases por horas, reservas y facturación para estudios de salsa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
