import { useCallback, useMemo, useSyncExternalStore } from "react";

// Fábrica: crea un hook que maneja una lista de ids guardada en localStorage.
// Sirve para favoritos Y comparador, solo cambia la clave y el máximo.
export function crearListaPersistente(clave: string, max = Infinity) {
  // Componentes que "escuchan" esta lista; los avisamos cuando cambia
  const oyentes = new Set<() => void>();

  // Leemos el TEXTO crudo (no el arreglo). useSyncExternalStore compara con
  // Object.is, y un string igual es "el mismo valor"; un arreglo nuevo en cada
  // lectura provocaría renders infinitos.
  const leerRaw = () => {
    try {
      return localStorage.getItem(clave) ?? "[]";
    } catch {
      return "[]"; // localStorage puede fallar (modo privado, permisos)
    }
  };

  // Convertimos a string[] validando, por si alguien editó el storage a mano
  const parsear = (raw: string): string[] => {
    try {
      const data: unknown = JSON.parse(raw);
      return Array.isArray(data)
        ? data.filter((x): x is string => typeof x === "string")
        : [];
    } catch {
      return [];
    }
  };

  // El evento "storage" cubre cambios hechos desde OTRA pestaña; los "oyentes"
  // cubren esta misma pestaña (el evento storage no se dispara en la que escribe).
  const suscribirse = (cb: () => void) => {
    oyentes.add(cb);
    window.addEventListener("storage", cb);
    return () => {
      oyentes.delete(cb);
      window.removeEventListener("storage", cb);
    };
  };

  const escribir = (ids: string[]) => {
    try {
      localStorage.setItem(clave, JSON.stringify(ids));
    } catch {
      // si no se puede guardar, simplemente no persiste
    }
    oyentes.forEach((o) => o()); // avisamos a todos los componentes suscritos
  };

  // Suscripción vacía: solo la usamos para saber si ya hidratamos
  const noSuscribir = () => () => {};

  return function useLista() {
    // El tercer argumento es el valor en el SERVIDOR (donde no hay localStorage).
    // Así servidor y primer render del cliente coinciden y no hay error de hidratación.
    const raw = useSyncExternalStore(suscribirse, leerRaw, () => "[]");
    // false en servidor y durante la hidratación, true después.
    const listo = useSyncExternalStore(
      noSuscribir,
      () => true,
      () => false
    );
    const ids = useMemo(() => parsear(raw), [raw]);

    // Agrega si no está, quita si ya está. Leemos el storage al momento del
    // click (no el estado del render) para no trabajar con datos viejos.
    const alternar = useCallback((id: string) => {
      const actual = parsear(leerRaw());
      if (actual.includes(id)) escribir(actual.filter((x) => x !== id));
      else if (actual.length < max) escribir([...actual, id]);
    }, []);

    const limpiar = useCallback(() => escribir([]), []);

    return { ids, alternar, limpiar, lleno: ids.length >= max, listo };
  };
}
