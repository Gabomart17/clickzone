import Link from "next/link";
import type { Producto } from "@/types/producto";

// Sin "use client": no usa hooks, así que puede renderizarse en el servidor
// y se reutiliza tanto en Server como en Client Components.
// Record<Categoria, string> obliga a cubrir TODAS las categorías: si agregamos
// una nueva al tipo, TypeScript nos avisa que falta su emoji.
const iconos: Record<Producto["categoria"], string> = {
  mouse: "🖱️",
  teclado: "⌨️",
  headset: "🎧",
  monitor: "🖥️",
};

export default function ProductCard({ producto }: { producto: Producto }) {
  return (
    <Link
      href={`/productos/${producto.id}`}
      className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-emerald-500/60 hover:bg-zinc-900/60"
    >
      {/* No tenemos imágenes aún; el emoji hace de placeholder visual */}
      <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-zinc-800 text-5xl">
        {iconos[producto.categoria]}
      </div>

      <span className="text-xs uppercase tracking-wide text-emerald-400">
        {producto.categoria}
      </span>
      <h3 className="mt-1 font-semibold group-hover:text-emerald-400">
        {producto.nombre}
      </h3>
      <p className="text-sm text-zinc-400">{producto.marca}</p>

      {/* mt-auto empuja el precio al fondo para que todas las cards alineen */}
      <p className="mt-auto pt-4 text-lg font-bold">${producto.precio}</p>
    </Link>
  );
}