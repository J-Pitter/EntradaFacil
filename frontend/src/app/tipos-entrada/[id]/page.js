'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

export default function DetalleTipoEntradaPage() {
  const { id } = useParams();
  const [tipo, setTipo] = useState(null);
  const [evento, setEvento] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const respTipo = await api.obtener('tipos-entrada', id);
        setTipo(respTipo.data);

        const respEvento = await api.obtener('eventos', respTipo.data.evento_id);
        setEvento(respEvento.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  const filas = tipo
    ? [
        { etiqueta: 'ID', valor: tipo.id },
        { etiqueta: 'Evento', valor: evento ? evento.titulo : `Evento #${tipo.evento_id}` },
        { etiqueta: 'Tipo', valor: tipo.nombre },
        {
          etiqueta: 'Precio',
          valor: Number(tipo.precio).toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0,
          }),
        },
        { etiqueta: 'Cantidad disponible', valor: tipo.cantidad_disponible.toLocaleString('es-CO') },
        { etiqueta: 'Cantidad vendida', valor: tipo.cantidad_vendida.toLocaleString('es-CO') },
      ]
    : [];

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Detalle de tipo de entrada" />

      {error && <Alert tipo="error">{error}</Alert>}
      {cargando && <Spinner />}

      {tipo && (
        <div className="mt-4 rounded-2xl border border-[#e9e4f0] bg-white p-6">
          <dl className="space-y-4">
            {filas.map((f) => (
              <div key={f.etiqueta}>
                <dt className="text-sm text-[#776d86]">{f.etiqueta}</dt>
                <dd className="font-medium text-[#241a36]">{f.valor}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {tipo && (
          <Link
            href={`/tipos-entrada/${tipo.id}/editar`}
            className="rounded-[10px] bg-[#7138e8] px-4 py-2 text-sm font-medium text-white"
          >
            Editar
          </Link>
        )}
        <Link href="/tipos-entrada" className="px-4 py-2 text-sm font-medium text-[#776d86]">
          Volver a la lista
        </Link>
      </div>
    </div>
  );
}