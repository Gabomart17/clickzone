"use client";

import Link from "next/link";
import { productos } from "@/data/productos";
import { useComparador } from "@/lib/listas";

export default function Comparador() {
  const { ids, alternar, limpiar, lleno, listo } = useComparador();

  if (!listo) return <p className="text-zinc-400">Cargando comparador...</p>;

  const seleccionados = productos.filter((p) => ids.includes(p.id));
  const disponibles = productos.filter((p) => !ids.includes(p.id));

  // Unión de TODAS las specs de los productos elegidos. Como cada categoría
  // tiene specs distintas, el Set evita filas repetidas; si un producto no
  // tiene esa spec, mostramos "—".
  const filasSpecs = Array.from(
    new Set(seleccionados.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        {/* value="" fijo: después de elegir, el select vuelve a "Agregar..." */}
        <select
          value=""
          onChange={(e) => e.target.value && alternar(e.target.value)}
          disabled={lleno}
          aria-label="Agregar producto al comparador"
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm disabled:opacity-50"
        >
          <option value="">
            {lleno ? "Máximo 3 productos" : "+ Agregar producto..."}
          </option>
          {disponibles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.marca} {p.nombre}
            </option>
          ))}
        </select>

        {seleccionados.length > 0 && (
          <button
            onClick={limpiar}
            className="text-sm text-zinc-400 hover:text-red-400"
          >
            Vaciar comparador
          </button>
        )}
      </div>

      {seleccionados.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-zinc-400">
            Elegí hasta 3 productos para compararlos lado a lado.
          </p>
          <Link
            href="/productos"
            className="mt-4 inline-block text-emerald-400 hover:underline"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        // overflow-x-auto: en móvil la tabla se desliza en vez de romper el layout
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-zinc-900">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-400">&nbsp;</th>
                {seleccionados.map((p) => (
                  <th key={p.id} className="px-4 py-3">
                    <Link
                      href={`/productos/${p.id}`}
                      className="font-semibold hover:text-emerald-400"
                    >
                      {p.nombre}
                    </Link>
                    <button
                      onClick={() => alternar(p.id)}
                      aria-label={`Quitar ${p.nombre} del comparador`}
                      className="ml-2 text-zinc-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              <Fila titulo="Marca" valores={seleccionados.map((p) => p.marca)} />
              <Fila
                titulo="Categoría"
                valores={seleccionados.map((p) => p.categoria)}
              />
              <Fila
                titulo="Precio"
                valores={seleccionados.map((p) => `$${p.precio}`)}
              />
              {filasSpecs.map((spec) => (
                <Fila
                  key={spec}
                  titulo={spec}
                  valores={seleccionados.map((p) => p.specs[spec] ?? "—")}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Fila reutilizable: título a la izquierda y un valor por cada producto
function Fila({ titulo, valores }: { titulo: string; valores: string[] }) {
  return (
    <tr>
      <th className="px-4 py-3 font-medium text-zinc-400">{titulo}</th>
      {valores.map((v, i) => (
        <td key={i} className="px-4 py-3">
          {v}
        </td>
      ))}
    </tr>
  );
}
