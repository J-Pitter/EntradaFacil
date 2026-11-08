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
  { clave: 'email', titulo: 'Correo' },
  { clave: 'telefono', titulo: 'Teléfono' },
  {
    clave: 'fecha_registro',
    titulo: 'Registro',
    render: (f) => new Date(f.fecha_registro).toLocaleDateString('es-CO'),
  },
  { clave: 'estado', titulo: 'Estado' },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.listar('usuarios');
        setUsuarios(respuesta.data);
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
      await api.eliminar('usuarios', aEliminar.id);
      setUsuarios((prev) => prev.filter((u) => u.id !== aEliminar.id));
      setExito(`Usuario "${aEliminar.nombre}" eliminado correctamente`);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
      setAEliminar(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader titulo="Usuarios" />

      <Link
        href="/usuarios/nuevo"
        className="mb-4 inline-block rounded-[10px] bg-[#7138e8] px-4 py-2 text-sm font-medium text-white"
      >
        + Nuevo usuario
      </Link>

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}

      {cargando ? (
        <Spinner />
      ) : usuarios.length === 0 ? (
        <EmptyState mensaje="Aún no hay usuarios registrados" />
      ) : (
        <DataTable
          columnas={columnas}
          filas={usuarios}
          basePath="/usuarios"
          onEliminar={setAEliminar}
        />
      )}

      <ConfirmModal
        abierto={aEliminar !== null}
        mensaje={`Se eliminará el usuario "${aEliminar?.nombre}". Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
      />
    </div>
  );
}