"use client"; // Usa useState/useEffect y hace fetch desde el navegador

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Categoria, Producto } from "@/types/producto";

// "todas" no es una categoría real, solo una opción del filtro.
// Por eso la unimos aparte en vez de meterla en el tipo Categoria.
const categorias: ("todas" | Categoria)[] = [
  "todas",
  "mouse",
  "teclado",
  "headset",
  "monitor",
];

// Guardamos el resultado junto con la "clave" de la consulta que lo produjo.
// Así calculamos "cargando" comparando claves, en vez de llamar a
// setCargando(true) dentro del efecto (eso causa renders en cascada y el
// linter de React 19 lo marca como error).
type Resultado = { clave: string; productos: Producto[]; error: boolean };

export default function Catalogo() {
  const [categoria, setCategoria] = useState<"todas" | Categoria>("todas");
  const [busqueda, setBusqueda] = useState(""); // lo que se ve en el input
  const [consulta, setConsulta] = useState(""); // la búsqueda "con debounce"
  const [intento, setIntento] = useState(0); // sube al tocar "Reintentar"
  const [resultado, setResultado] = useState<Resultado | null>(null);

  // La clave identifica la consulta actual; si cambia algo, cambia la clave
  const clave = `${categoria}|${consulta}|${intento}`;
  // Si el resultado guardado es de otra clave, todavía estamos esperando
  const cargando = resultado?.clave !== clave;

  // Debounce: esperamos 400 ms desde la última tecla antes de consultar la API.
  // Sin esto haríamos un request por cada letra que escribe el usuario.
  useEffect(() => {
    const timer = setTimeout(() => setConsulta(busqueda.trim()), 400);
    // La limpieza cancela el timer si el usuario sigue escribiendo
    return () => clearTimeout(timer);
  }, [busqueda]);

  // Pedimos los productos a NUESTRA API cada vez que cambia un filtro
  useEffect(() => {
    // AbortController cancela el request viejo si el usuario cambia el filtro
    // antes de que termine; así una respuesta lenta no pisa a una más nueva.
    const controller = new AbortController();

    async function cargar() {
      try {
        const params = new URLSearchParams();
        if (categoria !== "todas") params.set("categoria", categoria);
        if (consulta) params.set("q", consulta);

        const res = await fetch(`/api/productos?${params}`, {
          signal: controller.signal,
        });
        // fetch NO lanza error con un 404 o 500, hay que revisarlo a mano
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: Producto[] = await res.json();
        setResultado({ clave, productos: data, error: false });
      } catch (e) {
        // Si fue una cancelación nuestra, no es un error real: salimos callados
        if (e instanceof DOMException && e.name === "AbortError") return;
        setResultado({ clave, productos: [], error: true });
      }
    }

    cargar();
    // Al cambiar los filtros (o desmontar), cancelamos el request pendiente
    return () => controller.abort();
  }, [categoria, consulta, clave]);

  return (
    <div className="space-y-6">
      {/* Controles: buscador + botones de categoría */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o marca..."
          aria-label="Buscar productos"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 outline-none focus:border-emerald-400 md:max-w-sm"
        />

        {/* flex-wrap para que los botones bajen de línea en pantallas chicas */}
        <div className="flex flex-wrap gap-2">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => setCategoria(c)}
              // aria-pressed le dice a lectores de pantalla cuál está activo
              aria-pressed={categoria === c}
              className={`rounded-full px-4 py-1.5 text-sm capitalize transition ${
                categoria === c
                  ? "bg-emerald-500 font-semibold text-zinc-950"
                  : "border border-zinc-700 text-zinc-300 hover:border-emerald-400"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Estado 1: cargando. Skeletons con la misma forma que las cards
          para que la página no "salte" cuando llegan los datos. */}
      {cargando && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900"
            />
          ))}
        </div>
      )}

      {/* Estado 2: error, con botón para reintentar */}
      {!cargando && resultado?.error && (
        <div
          role="alert"
          className="rounded-xl border border-red-900 bg-red-950/40 p-8 text-center"
        >
          <p className="font-semibold text-red-300">
            No pudimos cargar los productos.
          </p>
          <button
            onClick={() => setIntento((n) => n + 1)}
            className="mt-4 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Estado 3: sin resultados (la API respondió bien, pero con lista vacía) */}
      {!cargando && resultado && !resultado.error && resultado.productos.length === 0 && (
        <p className="py-12 text-center text-zinc-400">
          No hay productos que coincidan con tu búsqueda.
        </p>
      )}

      {/* Estado 4: hay productos */}
      {!cargando && resultado && !resultado.error && resultado.productos.length > 0 && (
        <>
          <p className="text-sm text-zinc-400">
            {resultado.productos.length} producto(s)
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {resultado.productos.map((p) => (
              <ProductCard key={p.id} producto={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}