'use client';

import { useEffect, useState } from 'react';
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
];

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.listar('categorias');
        setCategorias(respuesta.data);
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
      await api.eliminar('categorias', aEliminar.id);
      setCategorias((prev) => prev.filter((c) => c.id !== aEliminar.id));
      setExito(`Categoría "${aEliminar.nombre}" eliminada correctamente`);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
      setAEliminar(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader titulo="Categorías" />

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}

      {cargando ? (
        <Spinner />
      ) : categorias.length === 0 ? (
        <EmptyState mensaje="Aún no hay categorías registradas" />
      ) : (
        <DataTable
          columnas={columnas}
          filas={categorias}
          basePath="/categorias"
          onEliminar={setAEliminar}
        />
      )}

      <ConfirmModal
        abierto={aEliminar !== null}
        mensaje={`Se eliminará "${aEliminar?.nombre}". Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
      />
    </div>
  );
}