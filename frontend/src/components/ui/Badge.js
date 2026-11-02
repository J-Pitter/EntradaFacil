const estilos = {
  activo: 'bg-exito-fondo text-exito-texto',
  inactivo: 'bg-aviso-fondo text-aviso-texto',
};

export default function Badge({ tipo = 'activo', children }) {
  return (
    <span
      className={`inline-flex h-[22px] items-center rounded-full px-2 text-[10px] font-semibold ${estilos[tipo]}`}
    >
      {children}
    </span>
  );
}