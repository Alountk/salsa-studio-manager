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
      <head>
        {/*
          Material Symbols, the icon font every primitive uses. It has to be a
          link tag: Turbopack drops a remote @import url() from bundled CSS, and
          next/font does not support icon fonts. Loaded here so it applies to
          every route, not just one page.
        */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font --
            the App Router root layout is the _document equivalent, so this
            link loads on every route, not just one page. The rule only knows
            about the pages/ router. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
