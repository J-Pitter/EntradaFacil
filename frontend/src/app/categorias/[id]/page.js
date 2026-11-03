'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

export default function DetalleCategoriaPage() {
  const { id } = useParams();
  const [categoria, setCategoria] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.obtener('categorias', id);
        setCategoria(respuesta.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Detalle de categoría" />

      {error && <Alert tipo="error">{error}</Alert>}
      {cargando && <Spinner />}

      {categoria && (
        <div className="mt-4 rounded-2xl border border-[#e9e4f0] bg-white p-6">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-[#776d86]">ID</dt>
              <dd className="font-medium text-[#241a36]">{categoria.id}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#776d86]">Nombre</dt>
              <dd className="font-medium text-[#241a36]">{categoria.nombre}</dd>
            </div>
          </dl>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {categoria && (
          <Link
            href={`/categorias/${categoria.id}/editar`}
            className="rounded-[10px] bg-[#7138e8] px-4 py-2 text-sm font-medium text-white"
          >
            Editar
          </Link>
        )}
        <Link href="/categorias" className="px-4 py-2 text-sm font-medium text-[#776d86]">
          Volver a la lista
        </Link>
      </div>
    </div>
  );
}