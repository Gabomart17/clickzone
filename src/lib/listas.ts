import { crearListaPersistente } from "@/lib/listaPersistente";

// Dos listas independientes con su propia clave en localStorage.
// El prefijo "clickzone:" evita choques con otras apps en localhost.
export const useFavoritos = crearListaPersistente("clickzone:favoritos");

// Máximo 3 para que la tabla del comparador siga siendo legible en pantalla
export const useComparador = crearListaPersistente("clickzone:comparar", 3);
