import Link from 'next/link';

const estilos = {
  primario: 'bg-primario text-white border border-primario hover:opacity-90',
  acento: 'bg-acento text-texto border border-acento hover:opacity-90',
  secundario: 'bg-white text-primario border border-borde hover:bg-primario-suave',
  peligro: 'bg-peligro text-white border border-peligro hover:opacity-90',
};

export default function Button({
  variante = 'primario',
  href,
  type = 'button',
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const clases = `inline-flex h-[52px] items-center justify-center rounded-boton px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:border-borde disabled:bg-borde disabled:text-texto-suave ${estilos[variante]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={clases}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} disabled={disabled} className={clases} {...props}>
      {children}
    </button>
  );
}