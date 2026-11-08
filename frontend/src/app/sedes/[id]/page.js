'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

export default function DetalleSedePage() {
  const { id } = useParams();
  const [sede, setSede] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.obtener('sedes', id);
        setSede(respuesta.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  const filas = sede
    ? [
        { etiqueta: 'ID', valor: sede.id },
        { etiqueta: 'Nombre', valor: sede.nombre },
        { etiqueta: 'Dirección', valor: sede.direccion },
        { etiqueta: 'Ciudad', valor: sede.ciudad },
        { etiqueta: 'Capacidad', valor: Number(sede.capacidad).toLocaleString('es-CO') },
      ]
    : [];

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Detalle de sede" />

      {error && <Alert tipo="error">{error}</Alert>}
      {cargando && <Spinner />}

      {sede && (
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
        {sede && (
          <Link
            href={`/sedes/${sede.id}/editar`}
            className="rounded-[10px] bg-[#7138e8] px-4 py-2 text-sm font-medium text-white"
          >
            Editar
          </Link>
        )}
        <Link href="/sedes" className="px-4 py-2 text-sm font-medium text-[#776d86]">
          Volver a la lista
        </Link>
      </div>
    </div>
  );
}