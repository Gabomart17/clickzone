import type { Metadata } from "next";
import Catalogo from "@/components/Catalogo";

// La metadata solo se puede exportar desde Server Components. Por eso la
// página es de servidor y le delega lo interactivo al Client Component.
export const metadata: Metadata = {
  title: "Productos", // con el template del layout queda "Productos | ClickZone"
};

export default function ProductosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Productos</h1>
      <Catalogo />
    </div>
  );
}