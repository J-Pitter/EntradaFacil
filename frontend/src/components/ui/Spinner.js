export default function Spinner({ texto = 'Cargando registros...' }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center gap-3 rounded-tarjeta border border-borde bg-white p-10 text-sm text-texto-suave"
    >
      <span className="size-8 animate-spin rounded-full border-4 border-primario-suave border-t-primario" />
      {texto}
    </div>
  );
}