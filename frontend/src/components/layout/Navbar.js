'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const enlaces = [
  { href: '/', texto: 'Área de trabajo' },
  { href: '/categorias', texto: 'Categorías' },
  { href: '/sedes', texto: 'Sedes' },
  { href: '/usuarios', texto: 'Usuarios' },
  { href: '/tipos-entrada', texto: 'Tipos de entrada' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);
  const esActivo = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="relative border-b border-borde bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-extrabold tracking-tight text-primario">
          EntradaFácil
        </Link>
        <button className="md:hidden" onClick={() => setAbierto(!abierto)} aria-label="Abrir menú">
          ☰
        </button>
        <nav className={`${abierto ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-1 bg-white p-4 shadow md:static md:flex md:flex-row md:p-0 md:shadow-none`}>
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              onClick={() => setAbierto(false)}
              className={`rounded-boton px-4 py-2 text-sm font-semibold ${esActivo(e.href) ? 'bg-primario-suave text-primario' : 'text-texto-suave hover:text-primario'
                }`}
            >
              {e.texto}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}