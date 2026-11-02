import Link from 'next/link';
import Button from './Button';

export default function PageHeader({ migas = [], titulo, descripcion, accion }) {
  return (
    <section className="mb-8 rounded-tarjeta border border-borde bg-white p-6 md:p-8">
      <nav
        aria-label="Ruta de navegación"
        className="mb-3 flex flex-wrap items-center gap-2 text-xs text-texto-suave"
      >
        <Link href="/" className="text-primario">
          Área de trabajo
        </Link>
        {migas.map((m) => (
          <span key={m.texto} className="flex items-center gap-2">
            <span>›</span>
            {m.href ? (
              <Link href={m.href} className="text-primario">
                {m.texto}
              </Link>
            ) : (
              <span>{m.texto}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{titulo}</h1>
          {descripcion && <p className="mt-2 text-texto-suave">{descripcion}</p>}
        </div>
        {accion && <Button href={accion.href}>+ {accion.texto}</Button>}
      </div>
    </section>
  );
}