import Button from './Button';

export default function EmptyState({ titulo, texto, accion }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-tarjeta border border-borde bg-white p-10 text-center">
      <h2 className="text-lg font-bold">{titulo}</h2>
      {texto && <p className="text-sm text-texto-suave">{texto}</p>}
      {accion && (
        <Button href={accion.href} className="mt-3">
          {accion.texto}
        </Button>
      )}
    </div>
  );
}