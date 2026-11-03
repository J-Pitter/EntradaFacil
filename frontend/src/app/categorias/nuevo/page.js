'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';

export default function NuevaCategoriaPage() {
  const [nombre, setNombre] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

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
      await api.crear('categorias', { nombre: nombre.trim() });
      setExito(`Categoría "${nombre.trim()}" creada correctamente`);
      setNombre('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Nueva categoría" />

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}

      <form onSubmit={manejarEnvio} className="mt-4 space-y-4">
        <FormField
          etiqueta="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar'}
          </Button>
          <Link href="/categorias" className="px-4 py-2 text-sm font-medium text-[#776d86]">
            Volver a la lista
          </Link>
        </div>
      </form>
    </div>
  );
}