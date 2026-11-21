// Next lo envuelve automáticamente en un <Suspense> para toda la ruta
// /productos y sus hijas (incluido /productos/[id]). Se muestra mientras
// la página carga y le da la frontera que Cache Components necesita.
export default function Loading() {
  return (
    <div className="animate-pulse space-y-6" aria-busy="true">
      <div className="h-8 w-48 rounded bg-zinc-800" />
      <div className="h-72 rounded-xl bg-zinc-900" />
      <div className="h-6 w-2/3 rounded bg-zinc-800" />
    </div>
  );
}
