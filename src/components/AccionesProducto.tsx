"use client"; // Usa hooks y localStorage

import { useComparador, useFavoritos } from "@/lib/listas";

export default function AccionesProducto({ id }: { id: string }) {
  const favoritos = useFavoritos();
  const comparador = useComparador();

  const esFavorito = favoritos.ids.includes(id);
  const enComparador = comparador.ids.includes(id);
  // Si el comparador está lleno y este producto no está adentro, no se puede sumar
  const bloqueado = comparador.lleno && !enComparador;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => favoritos.alternar(id)}
        aria-pressed={esFavorito}
        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition ${
          esFavorito
            ? "bg-emerald-500 text-zinc-950"
            : "border border-zinc-700 hover:border-emerald-400"
        }`}
      >
        {esFavorito ? "♥ En favoritos" : "♡ Agregar a favoritos"}
      </button>

      <button
        onClick={() => comparador.alternar(id)}
        disabled={bloqueado}
        aria-pressed={enComparador}
        className={`rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          enComparador
            ? "bg-emerald-500 text-zinc-950"
            : "border border-zinc-700 hover:border-emerald-400"
        }`}
      >
        {enComparador
          ? "✓ En el comparador"
          : bloqueado
            ? "Comparador lleno (máx. 3)"
            : "+ Comparar"}
      </button>
    </div>
  );
}
