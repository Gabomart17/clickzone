// Definimos el tipo en UN solo lugar para que la API, las páginas y los
// componentes compartan el mismo contrato. Si cambia un campo, TypeScript
// nos avisa dónde se rompe algo.

// Unión de strings en vez de "string" suelto: evita typos como "mouze"
// y nos da autocompletado en los filtros.
export type Categoria = "mouse" | "teclado" | "headset" | "monitor";

export interface Producto {
  id: string; // string porque en la URL (/productos/[id]) todo llega como texto
  nombre: string;
  marca: string;
  categoria: Categoria;
  precio: number; // en USD
  descripcion: string;
  destacado: boolean; // lo usamos en la landing para mostrar solo algunos
  // Record<string, string> permite specs distintas por categoría
  // (un mouse tiene DPI, un monitor tiene Hz) sin crear un tipo por cada una
  specs: Record<string, string>;
}