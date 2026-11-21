"use client"; // Los error boundaries tienen que ser Client Components

import { useEffect } from "react";

// En Next 16 la función para reintentar se llama "retry" (en versiones
// anteriores era "reset"). Lo confirmé en la documentación local de Next.
export default function Error({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    // Acá iría el envío a un servicio de monitoreo; por ahora, la consola
    console.error(error);
  }, [error]);

  return (
    <div
      role="alert"
      className="mx-auto max-w-md rounded-xl border border-red-900 bg-red-950/40 p-8 text-center"
    >
      <h2 className="text-xl font-bold text-red-300">Algo salió mal</h2>
      <p className="mt-2 text-sm text-zinc-400">
        No pudimos mostrar esta página. Probá de nuevo; si sigue fallando,
        volvé al inicio.
      </p>
      <button
        onClick={() => retry()}
        className="mt-6 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
      >
        Reintentar
      </button>
    </div>
  );
}
