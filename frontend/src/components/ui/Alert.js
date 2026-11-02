const estilos = {
  exito: 'bg-exito-fondo text-exito-texto',
  error: 'bg-peligro-fondo text-peligro',
  aviso: 'bg-aviso-fondo text-aviso-texto',
};

const iconos = { exito: '✓', error: '!', aviso: '⚠' };

export default function Alert({ tipo = 'exito', titulo, children, onCerrar }) {
  return (
    <div
      role={tipo === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-boton p-5 ${estilos[tipo]}`}
    >
      <span className="text-lg leading-none" aria-hidden="true">
        {iconos[tipo]}
      </span>
      <div className="flex-1">
        {titulo && <p className="text-sm font-semibold">{titulo}</p>}
        <p className="text-xs leading-relaxed">{children}</p>
      </div>
      {onCerrar && (
        <button
          type="button"
          onClick={onCerrar}
          aria-label="Cerrar alerta"
          className="text-lg leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}