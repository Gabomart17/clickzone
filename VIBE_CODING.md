# Proceso de Vibe Coding: ClickZone

## Iteración 1: Concepción y setup

**Prompt principal:**

> Pegué el enunciado completo de la actividad (Next.js 16, App Router, TypeScript, 4+ rutas, API, Server/Client Components, useState/useEffect, responsive, loading/error UI, Vercel, GitHub, VIBE_CODING.md) y pedí hacerla con temática de periféricos gaming.

**Resultado:** concepto de catálogo con 5 rutas, Route Handlers, plan de 8 pasos (setup, datos y API, layout y landing, catálogo, detalle/comparador/favoritos, loading/error, documentación, deploy).

**Decisiones técnicas:** App Router + TypeScript + Tailwind; datos de ejemplo servidos por Route Handlers.

### Desafío 1: `git push` falló con `src refspec main does not match any`

- **Primer diagnóstico de la IA (incorrecto):** faltaba el primer commit.
- **Evidencia:** `git status` mostraba rutas `../cart-react/`, `../curseforge/`, etc.
- **Causa real:** había un repositorio Git en `C:\Users\gabri` y `clickzone` quedó dentro de él, por eso `create-next-app` no hizo su propio `git init`.
- **Solución:** quitar el remoto mal puesto (`git remote remove origin`), `git init` dentro de `clickzone`, verificar con `git rev-parse --show-toplevel`, y recién ahí commit + push.
- **Lección:** validar el diagnóstico de la IA contra la salida real de la terminal.

## Iteración 2: Datos y API

**Prompt principal:**

> Paso 2: crear el tipo `Producto`, datos de ejemplo de periféricos gaming y Route Handlers en `/api/productos` con filtros por categoría y búsqueda, más el detalle por id con 404.

**Resultado:** tipo `Producto`, 8 productos y dos Route Handlers.

**Decisiones técnicas:**

- Datos en un archivo `.ts` (no `.json`) para que TypeScript valide cada producto.
- `params` con `await`, porque en Next 15+ es una Promise.
- 404 explícito con JSON cuando el id no existe, en vez de `null` con status 200.

### Desafío 2: `GET /api/productos` devolvía 404

- **Evidencia:** la consola mostraba `GET /api/productos 404` aunque el servidor corría bien.
- **Diagnóstico:** listé los `route.ts` con `Get-ChildItem` y salieron en `src/data/api/...` en vez de `src/app/api/...`.
- **Solución:** `Move-Item -LiteralPath` (los corchetes de `[id]` requieren `-LiteralPath` en PowerShell).
- **Lección:** en App Router la estructura de carpetas ES la ruta.

## Iteración 3: Layout, Navbar y landing

**Prompt principal:**

> Paso 3: layout raíz con tema oscuro, Navbar responsive con menú móvil, `ProductCard` reutilizable y landing con destacados. Tené en cuenta que uso Next 16.4.6 con Cache Components.

**Decisiones técnicas:**

- Navbar como Client Component (`usePathname`, `useState`); el resto, en servidor.
- Navbar dentro de `<Suspense>` por Cache Components.
- La landing importa los datos directo del módulo (sin fetch a la propia API).
- `Record<Categoria, string>` para obligar a cubrir todos los íconos.

## Iteración 4: Catálogo con filtros

**Prompt principal:**

> Paso 4: catálogo en `/productos` que consuma mi API con `useEffect`, con filtro por categoría, búsqueda y estados de carga y error.

**Decisiones técnicas:**

- Debounce de 400 ms en el buscador.
- `AbortController` para cancelar requests viejos (evita condiciones de carrera).
- Revisión manual de `res.ok`, porque `fetch` no lanza error con 404/500.
- El estado "cargando" se **deriva** de una clave de consulta en vez de llamar `setCargando(true)` dentro del efecto, para respetar las reglas de React 19.

## Iteración 5: Detalle, favoritos y comparador

**Prompt principal:**

> Paso 5: página de detalle `/productos/[id]`, favoritos y comparador de hasta 3 productos, persistidos en el navegador. Respetar Cache Components.

**Decisiones técnicas:**

- Fábrica `crearListaPersistente` para no duplicar lógica entre favoritos y comparador.
- `useSyncExternalStore` en vez de `useEffect` + `useState` para leer `localStorage`: evita errores de hidratación.
- Solo se guardan ids; los productos se resuelven contra el catálogo.
- `notFound()` para ids inexistentes y `loading.tsx` como frontera de Suspense.
- Tabla del comparador con la unión de specs, porque cada categoría tiene campos distintos.
  .

### Desafío 4: `new Date()` rompe el prerender (Cache Components)

- **Error:** `Next.js encountered the unstable value new Date() while prerendering` en el footer del layout.
- **Causa:** con Cache Components, un valor que cambia entre renders no se puede usar directo en un componente que se prerenderiza. La IA generó código válido para versiones anteriores de Next.
- **Solución:** aislar el año en el componente `AnioActual` con la directiva `"use cache"`.
- **Lección:** la IA puede generar código correcto pero desactualizado para la versión exacta del framework; el build lo detecta.

## Iteración 6: Estados de error y 404, empaquetado final

**Resultado:** `error.tsx`, `not-found.tsx`, `.env.example` y documentación; build y lint verificados con `npm run build` y `npm run lint`, más prueba de todas las rutas y endpoints.

### Desafío 5: la IA asumió `reset` en `error.tsx`

- **Problema:** en versiones anteriores de Next, `error.tsx` recibe `reset`. La IA lo iba a usar por costumbre.
- **Verificación:** revisó la documentación local (`node_modules/next/dist/docs/.../error.md`) y en Next 16.4.6 la función se llama `retry`.
- **Solución:** `error.tsx` usa `retry`.

### Desafío 6: `.env.example` quedaba ignorado por Git

- **Causa:** `.gitignore` trae `.env*`, que también excluye `.env.example`, un entregable obligatorio.
- **Solución:** agregar la excepción `!.env.example`.

### Desafío 7: clase de Tailwind inexistente

- **Problema:** Se escribió una clase `capitalize-first` que no existe en Tailwind (no da error, simplemente no hace nada).
- **Solución:** se detectó al revisar el código y se eliminó.
- **Lección:** revisar el código generado línea por línea; lo que no falla ruidosamente igual puede estar mal.

## Despliegue

- Plataforma: Vercel, conectada al repositorio de GitHub.
- URL: _pendiente: pegar aquí la URL pública_
