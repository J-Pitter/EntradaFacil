'use client';

import { useEffect } from 'react';

export default function ConfirmModal({
  abierto,
  titulo = '¿Estás seguro?',
  mensaje,
  textoConfirmar = 'Eliminar',
  cargando = false,
  onConfirmar,
  onCancelar,
}) {
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e) => {
      if (e.key === 'Escape') onCancelar();
    };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto, onCancelar]);

  if (!abierto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#241a36]/50 p-4"
      onClick={onCancelar}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-2xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-[#241a36]">{titulo}</h2>
        <p className="mt-2 text-sm text-[#776d86]">{mensaje}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="rounded-[10px] border border-[#e9e4f0] px-4 py-2 text-sm font-medium text-[#241a36] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="rounded-[10px] bg-[#b42332] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {cargando ? 'Eliminando...' : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}