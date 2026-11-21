import type { Metadata } from "next";
import Comparador from "@/components/Comparador";

export const metadata: Metadata = { title: "Comparar" };

export default function CompararPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Comparar productos</h1>
      <Comparador />
    </div>
  );
}
