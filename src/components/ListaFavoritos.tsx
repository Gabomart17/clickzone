"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { productos } from "@/data/productos";
import { useFavoritos } from "@/lib/listas";

export default function ListaFavoritos() {
  const { ids, alternar, listo } = useFavoritos();

  // Hasta hidratar no sabemos qué hay guardado; evitamos un parpadeo de "vacío"
  if (!listo) return <p className="text-zinc-400">Cargando favoritos...</p>;

  // Cruzamos los ids guardados con el catálogo. Si un id ya no existe
  // (producto borrado), simplemente no aparece.
  const favoritos = productos.filter((p) => ids.includes(p.id));

  if (favoritos.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-zinc-400">Todavía no tenés favoritos.</p>
        <Link
          href="/productos"
          className="mt-4 inline-block rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-zinc-950 hover:bg-emerald-400"
        >
          Explorar catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {favoritos.map((p) => (
        <div key={p.id} className="space-y-2">
          <ProductCard producto={p} />
          <button
            onClick={() => alternar(p.id)}
            className="w-full rounded-lg border border-zinc-700 py-2 text-sm text-zinc-300 hover:border-red-400 hover:text-red-400"
          >
            Quitar de favoritos
          </button>
        </div>
      ))}
    </div>
  );
}
