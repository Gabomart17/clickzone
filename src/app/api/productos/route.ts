import { NextResponse } from "next/server";
import { productos } from "@/data/productos";

// En App Router un Route Handler se define exportando una función
// con el nombre del método HTTP (GET, POST...). El archivo SIEMPRE
// se llama route.ts, y la carpeta define la URL: /api/productos
export async function GET(request: Request) {
  // Leemos los query params (?categoria=mouse&q=razer).
  // Usamos URL en vez de parsear a mano porque ya decodifica espacios y acentos.
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");
  const q = searchParams.get("q")?.toLowerCase();

  let resultado = productos;

  // Filtramos solo si el parámetro vino; así sin filtros devuelve todo
  if (categoria) {
    resultado = resultado.filter((p) => p.categoria === categoria);
  }

  // Búsqueda simple por nombre o marca, en minúsculas para no depender de mayúsculas
  if (q) {
    resultado = resultado.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)
    );
  }

  // NextResponse.json arma el Content-Type y la serialización por nosotros
  return NextResponse.json(resultado);
}