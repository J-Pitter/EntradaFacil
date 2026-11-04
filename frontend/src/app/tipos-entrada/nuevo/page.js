'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';

export default function NuevoTipoEntradaPage() {
  const [eventos, setEventos] = useState([]);
  const [cargandoEventos, setCargandoEventos] = useState(true);

  const [eventoId, setEventoId] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    async function cargarEventos() {
      try {
        const respuesta = await api.listar('eventos');
        setEventos(respuesta.data);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargandoEventos(false);
      }
    }
    cargarEventos();
  }, []);

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');
    setExito('');

    if (eventoId === '') {
      setError('Debes seleccionar un evento');
      return;
    }
    if (nombre.trim() === '') {
      setError('El nombre es obligatorio');
      return;
    }
    if (/[.,]/.test(precio) || /[.,]/.test(cantidad)) {
  setError('Escribe los números sin puntos ni comas (ejemplo: 190000)');
  return;
}
    if (precio === '' || Number(precio) < 0) {
      setError('El precio debe ser un número mayor o igual a 0');
      return;
    }
    if (cantidad === '' || !Number.isInteger(Number(cantidad)) || Number(cantidad) < 1) {
      setError('La cantidad disponible debe ser un número entero mayor a 0');
      return;
    }

    setEnviando(true);
    try {
      await api.crear('tipos-entrada', {
        evento_id: Number(eventoId),
        nombre: nombre.trim(),
        precio: Number(precio),
        cantidad_disponible: Number(cantidad),
      });
      setExito(`Tipo de entrada "${nombre.trim()}" creado correctamente`);
      setEventoId('');
      setNombre('');
      setPrecio('');
      setCantidad('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Nuevo tipo de entrada" />

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}

      {cargandoEventos ? (
        <Spinner />
      ) : (
        <form onSubmit={manejarEnvio} className="mt-4 space-y-4">
          <div>
            <label htmlFor="evento" className="mb-1 block text-sm font-medium text-[#241a36]">
              Evento
            </label>
            <select
              id="evento"
              value={eventoId}
              onChange={(e) => setEventoId(e.target.value)}
              className="w-full rounded-[10px] border border-[#e9e4f0] bg-white px-3 py-3 text-[#241a36]"
            >
              <option value="">Selecciona un evento</option>
              {eventos.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.titulo}
                </option>
              ))}
            </select>
          </div>
              
          <FormField
            etiqueta="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <FormField
            etiqueta="Precio (COP)"
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
          <FormField
            etiqueta="Cantidad disponible"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar'}
            </Button>
            <Link href="/tipos-entrada" className="px-4 py-2 text-sm font-medium text-[#776d86]">
              Volver a la lista
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}