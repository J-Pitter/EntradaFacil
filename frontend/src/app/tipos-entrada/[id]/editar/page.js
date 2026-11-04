'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import Spinner from '@/components/ui/Spinner';
import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';

export default function EditarTipoEntradaPage() {
  const { id } = useParams();

  const [eventos, setEventos] = useState([]);
  const [vendidas, setVendidas] = useState(0);

  const [eventoId, setEventoId] = useState('');
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');

  const [cargando, setCargando] = useState(true);
  const [cargado, setCargado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const [respTipo, respEventos] = await Promise.all([
          api.obtener('tipos-entrada', id),
          api.listar('eventos'),
        ]);
        const tipo = respTipo.data;
        setEventos(respEventos.data);
        setEventoId(String(tipo.evento_id));
        setNombre(tipo.nombre);
        setPrecio(String(Number(tipo.precio)));
        setCantidad(String(tipo.cantidad_disponible));
        setVendidas(tipo.cantidad_vendida);
        setCargado(true);
      } catch (e) {
        setError(e.message);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, [id]);

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
    if (Number(cantidad) < vendidas) {
      setError(`La cantidad disponible no puede ser menor a las entradas ya vendidas (${vendidas})`);
      return;
    }

    setEnviando(true);
    try {
      await api.actualizar('tipos-entrada', id, {
        evento_id: Number(eventoId),
        nombre: nombre.trim(),
        precio: Number(precio),
        cantidad_disponible: Number(cantidad),
      });
      setExito('Tipo de entrada actualizado correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Editar tipo de entrada" />

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}
      {cargando && <Spinner />}

      {cargado && (
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
            etiqueta="Precio en COP, sin puntos (ej: 190000)"
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
              {enviando ? 'Guardando...' : 'Guardar cambios'}
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