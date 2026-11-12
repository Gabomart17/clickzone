import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import "./globals.css";

// next/font descarga la fuente en build y la sirve desde nuestro dominio:
// sin parpadeo de texto y sin request extra a Google en producción.
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

// Metadata a nivel raíz: título y descripción para SEO y pestaña del navegador
export const metadata: Metadata = {
  title: { default: "ClickZone", template: "%s | ClickZone" },
  description: "Catálogo de periféricos gaming: mouse, teclados, headsets y monitores.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={geist.variable}>
      <body className="min-h-screen">
        {/* Suspense porque Navbar usa usePathname y en rutas dinámicas
            (/productos/[id]) el pathname no se conoce al prerenderizar.
            Con Cache Components activado, Next exige esta frontera. */}
        <Suspense fallback={<div className="h-16" />}>
          <Navbar />
        </Suspense>
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <footer className="border-t border-zinc-800 py-6 text-center text-sm text-zinc-500">
          © {new Date().getFullYear()} ClickZone · Proyecto académico UDB
        </footer>
      </body>
    </html>
  );
}