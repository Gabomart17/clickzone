import { NextResponse } from "next/server";
import { productos } from "@/data/productos";

// Los corchetes [id] hacen la ruta dinámica: /api/productos/3 -> id = "3"
export async function GET(
  _request: Request, // el guion bajo indica que no lo usamos (ESLint no se queja)
  // En Next 15+ "params" es una Promise, por eso hay que hacerle await.
  // Si lo usás directo como objeto (estilo Next 14), te da error.
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const producto = productos.find((p) => p.id === id);

  // Respondemos 404 con un JSON claro en vez de devolver null con 200:
  // así el frontend distingue "no existe" de "todo bien".
  if (!producto) {
    return NextResponse.json(
      { error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(producto);
}