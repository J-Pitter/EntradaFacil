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

export default function EditarCategoriaPage() {
  const { id } = useParams();
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(true);
  const [cargado, setCargado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.obtener('categorias', id);
        setNombre(respuesta.data.nombre);
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

    setEnviando(true);
    try {
      await api.actualizar('categorias', id, { nombre: nombre.trim() });
      setExito('Categoría actualizada correctamente');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Editar categoría" />

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

          <div className="flex gap-3">
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Link href="/categorias" className="px-4 py-2 text-sm font-medium text-[#776d86]">
              Volver a la lista
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}