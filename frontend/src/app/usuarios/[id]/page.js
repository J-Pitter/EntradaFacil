'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';

export default function DetalleUsuarioPage() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.obtener('usuarios', id);
        setUsuario(respuesta.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

  const filas = usuario
    ? [
        { etiqueta: 'ID', valor: usuario.id },
        { etiqueta: 'Nombre', valor: usuario.nombre },
        { etiqueta: 'Correo', valor: usuario.email },
        { etiqueta: 'Teléfono', valor: usuario.telefono },
        {
          etiqueta: 'Fecha de registro',
          valor: new Date(usuario.fecha_registro).toLocaleString('es-CO'),
        },
        { etiqueta: 'Estado', valor: usuario.estado },
      ]
    : [];

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Detalle de usuario" />

      {error && <Alert tipo="error">{error}</Alert>}
      {cargando && <Spinner />}

      {usuario && (
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
        {usuario && (
          <Link
            href={`/usuarios/${usuario.id}/editar`}
            className="rounded-[10px] bg-[#7138e8] px-4 py-2 text-sm font-medium text-white"
          >
            Editar
          </Link>
        )}
        <Link href="/usuarios" className="px-4 py-2 text-sm font-medium text-[#776d86]">
          Volver a la lista
        </Link>
      </div>
    </div>
  );
}