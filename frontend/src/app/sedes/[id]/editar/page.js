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

export default function EditarSedePage() {
  const { id } = useParams();

  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [capacidad, setCapacidad] = useState('');

  const [cargando, setCargando] = useState(true);
  const [cargado, setCargado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.obtener('sedes', id);
        const sede = respuesta.data;
        setNombre(sede.nombre);
        setDireccion(sede.direccion);
        setCiudad(sede.ciudad);
        setCapacidad(String(sede.capacidad));
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

    if (nombre.trim() === '') {
      setError('El nombre es obligatorio');
      return;
    }
    if (direccion.trim() === '') {
      setError('La dirección es obligatoria');
      return;
    }
    if (ciudad.trim() === '') {
      setError('La ciudad es obligatoria');
      return;
    }
    if (/[.,]/.test(capacidad)) {
      setError('Escribe la capacidad sin puntos ni comas (ejemplo: 30000)');
      return;
    }
    if (capacidad === '' || !Number.isInteger(Number(capacidad)) || Number(capacidad) < 1) {
      setError('La capacidad debe ser un número entero mayor a 0');
      return;
    }

    setEnviando(true);
    try {
      await api.actualizar('sedes', id, {
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        ciudad: ciudad.trim(),
        capacidad: Number(capacidad),
      });
      setExito('Sede actualizada correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Editar sede" />

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}
      {cargando && <Spinner />}

      {cargado && (
        <form onSubmit={manejarEnvio} className="mt-4 space-y-4">
          <FormField
            etiqueta="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <FormField
            etiqueta="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
          <FormField
            etiqueta="Ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
          />
          <FormField
            etiqueta="Capacidad (personas, sin puntos. Ej: 30000)"
            type="number"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Link href="/sedes" className="px-4 py-2 text-sm font-medium text-[#776d86]">
              Volver a la lista
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}