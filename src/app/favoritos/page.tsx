import type { Metadata } from "next";
import ListaFavoritos from "@/components/ListaFavoritos";

export const metadata: Metadata = { title: "Favoritos" };

export default function FavoritosPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Favoritos</h1>
      <ListaFavoritos />
    </div>
  );
}
