// Server Component asíncrono. Con Cache Components, un componente que lleva
// "use cache" se calcula UNA vez y se reutiliza, así el valor "inestable"
// (new Date) ya no rompe el prerender. Tiene que ser async: es un requisito.
export default async function AnioActual() {
  "use cache"; // debe ir como primera línea del cuerpo

  return <>{new Date().getFullYear()}</>;
}
