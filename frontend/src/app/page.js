import Link from 'next/link';

const modulos = [
  { href: '/categorias', titulo: 'Categorías', texto: 'Organiza los eventos por tema.', nuevo: '/categorias/nuevo', accion: 'Nueva categoría' },
  { href: '/sedes', titulo: 'Sedes', texto: 'Administra lugares y capacidades.', nuevo: '/sedes/nuevo', accion: 'Nueva sede' },
  { href: '/usuarios', titulo: 'Usuarios', texto: 'Mantén los datos de tu equipo al día.', nuevo: '/usuarios/nuevo', accion: 'Nuevo usuario' },
  { href: '/tipos-entrada', titulo: 'Tipos de entrada', texto: 'Define las opciones de ingreso.', nuevo: '/tipos-entrada/nuevo', accion: 'Nuevo tipo de entrada' },
];

export default function AreaDeTrabajo() {
  return (
    <>
      <h1 className="text-4xl font-extrabold tracking-tight">Área de trabajo</h1>
      <p className="mt-2 text-texto-suave">Administra la información que hace posible cada gran plan.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {modulos.map((m) => (
          <div key={m.href} className="rounded-tarjeta border border-borde bg-white p-6">
            <h2 className="text-xl font-bold">{m.titulo}</h2>
            <p className="mt-1 text-sm text-texto-suave">{m.texto}</p>
            <div className="mt-5 flex items-center justify-between border-t border-borde pt-5">
              <Link href={m.href} className="rounded-boton bg-primario px-5 py-3 text-sm font-semibold text-white">
                Gestionar
              </Link>
              <Link href={m.nuevo} className="text-sm font-semibold text-primario">
                + {m.accion}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}