import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { productos } from "@/data/productos";

// Sin "use client" => Server Component. Importamos los datos directo del módulo:
// es más rápido que hacer fetch a nuestra propia API desde el servidor
// (evitamos un viaje HTTP innecesario). La API la consumimos en el catálogo.
export default function Home() {
  // Solo los marcados como destacados
  const destacados = productos.filter((p) => p.destacado);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="py-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          Equipá tu setup. <span className="text-emerald-400">Ganá más.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-zinc-400">
          Mouse, teclados, headsets y monitores pensados para jugar en serio.
          Compará specs y guardá tus favoritos.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/productos"
            className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-zinc-950 transition hover:bg-emerald-400"
          >
            Ver catálogo
          </Link>
          <Link
            href="/comparar"
            className="rounded-lg border border-zinc-700 px-6 py-3 font-semibold transition hover:border-emerald-400"
          >
            Comparar productos
          </Link>
        </div>
      </section>

      {/* Destacados: 1 columna en móvil, 2 en tablet, 4 en escritorio */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Destacados</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {destacados.map((p) => (
            <ProductCard key={p.id} producto={p} />
          ))}
        </div>
      </section>
    </div>
  );
}