'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import EmptyState from '@/components/ui/EmptyState';
import DataTable from '@/components/ui/DataTable';
import ConfirmModal from '@/components/ui/ConfirmModal';

const columnas = [
  { clave: 'id', titulo: 'ID' },
  { clave: 'nombre', titulo: 'Nombre' },
  { clave: 'direccion', titulo: 'Dirección' },
  { clave: 'ciudad', titulo: 'Ciudad' },
  {
    clave: 'capacidad',
    titulo: 'Capacidad',
    render: (f) => Number(f.capacidad).toLocaleString('es-CO'),
  },
];

export default function SedesPage() {
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.listar('sedes');
        setSedes(respuesta.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  async function confirmarEliminar() {
    setEliminando(true);
    setError('');
    setExito('');
    try {
      await api.eliminar('sedes', aEliminar.id);
      setSedes((prev) => prev.filter((s) => s.id !== aEliminar.id));
      setExito(`Sede "${aEliminar.nombre}" eliminada correctamente`);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
      setAEliminar(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader titulo="Sedes" />

      <Link
        href="/sedes/nuevo"
        className="mb-4 inline-block rounded-[10px] bg-[#7138e8] px-4 py-2 text-sm font-medium text-white"
      >
        + Nueva sede
      </Link>

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}

      {cargando ? (
        <Spinner />
      ) : sedes.length === 0 ? (
        <EmptyState mensaje="Aún no hay sedes registradas" />
      ) : (
        <DataTable
          columnas={columnas}
          filas={sedes}
          basePath="/sedes"
          onEliminar={setAEliminar}
        />
      )}

      <ConfirmModal
        abierto={aEliminar !== null}
        mensaje={`Se eliminará la sede "${aEliminar?.nombre}". Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
      />
    </div>
  );
}