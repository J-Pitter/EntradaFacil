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

export default function TiposEntradaPage() {
  const [tipos, setTipos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [aEliminar, setAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    async function cargar() {
      try {
        const [respTipos, respEventos] = await Promise.all([
          api.listar('tipos-entrada'),
          api.listar('eventos'),
        ]);
        setTipos(respTipos.data);
        setEventos(respEventos.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  function nombreEvento(eventoId) {
    const evento = eventos.find((ev) => ev.id === eventoId);
    return evento ? evento.titulo : `Evento #${eventoId}`;
  }

  const columnas = [
    { clave: 'id', titulo: 'ID' },
    { clave: 'evento_id', titulo: 'Evento', render: (f) => nombreEvento(f.evento_id) },
    { clave: 'nombre', titulo: 'Tipo' },
    {
      clave: 'precio',
      titulo: 'Precio',
      render: (f) =>
        Number(f.precio).toLocaleString('es-CO', {
          style: 'currency',
          currency: 'COP',
          maximumFractionDigits: 0,
        }),
    },
    {
      clave: 'cantidad_disponible',
      titulo: 'Disponibles',
      render: (f) => f.cantidad_disponible.toLocaleString('es-CO'),
    },
    {
      clave: 'cantidad_vendida',
      titulo: 'Vendidas',
      render: (f) => f.cantidad_vendida.toLocaleString('es-CO'),
    },
  ];

  async function confirmarEliminar() {
    setEliminando(true);
    setError('');
    setExito('');
    try {
      await api.eliminar('tipos-entrada', aEliminar.id);
      setTipos((prev) => prev.filter((t) => t.id !== aEliminar.id));
      setExito(`Tipo de entrada "${aEliminar.nombre}" eliminado correctamente`);
    } catch (e) {
      setError(e.message);
    } finally {
      setEliminando(false);
      setAEliminar(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <PageHeader titulo="Tipos de entrada" />
    
      <Link
      href="/tipos-entrada/nuevo"
      className="mb-4 inline-block rounded-[10px] bg-[#7138e8] px-4 py-2 text-sm font-medium text-white"
    >
      + Nuevo tipo de entrada
    </Link>
    
      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}

      {cargando ? (
        <Spinner />
      ) : tipos.length === 0 ? (
        <EmptyState mensaje="Aún no hay tipos de entrada registrados" />
      ) : (
        <DataTable
          columnas={columnas}
          filas={tipos}
          basePath="/tipos-entrada"
          onEliminar={setAEliminar}
        />
      )}

      <ConfirmModal
        abierto={aEliminar !== null}
        mensaje={`Se eliminará "${aEliminar?.nombre}" del evento "${aEliminar ? nombreEvento(aEliminar.evento_id) : ''}". Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onCancelar={() => setAEliminar(null)}
        onConfirmar={confirmarEliminar}
      />
    </div>
  );
}