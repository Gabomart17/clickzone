"use client"; // Necesario: usamos hooks (usePathname, useState) que solo existen en el cliente

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Los links viven en un arreglo para no repetir el JSX en escritorio y móvil
const links = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/comparar", label: "Comparar" },
  { href: "/favoritos", label: "Favoritos" },
];

export default function Navbar() {
  // usePathname nos dice la ruta actual para resaltar el link activo
  const pathname = usePathname();
  // Estado del menú hamburguesa (solo se ve en móvil)
  const [abierto, setAbierto] = useState(false);

  // Inicio solo está activo con ruta exacta ("/"); si usáramos startsWith("/")
  // quedaría resaltado en TODAS las páginas.
  const esActivo = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Click<span className="text-emerald-400">Zone</span>
        </Link>

        {/* Escritorio: "hidden md:flex" oculta en móvil y muestra desde 768px */}
        <ul className="hidden gap-6 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`text-sm transition-colors hover:text-emerald-400 ${
                  esActivo(l.href) ? "text-emerald-400" : "text-zinc-300"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Botón hamburguesa: solo móvil. aria-* para accesibilidad */}
        <button
          className="rounded p-2 text-zinc-300 md:hidden"
          onClick={() => setAbierto(!abierto)}
          aria-label="Abrir menú"
          aria-expanded={abierto}
        >
          {abierto ? "✕" : "☰"}
        </button>
      </nav>

      {/* Menú móvil desplegable; al tocar un link lo cerramos */}
      {abierto && (
        <ul className="border-t border-zinc-800 px-4 py-2 md:hidden">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setAbierto(false)}
                className={`block py-3 text-sm ${
                  esActivo(l.href) ? "text-emerald-400" : "text-zinc-300"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}