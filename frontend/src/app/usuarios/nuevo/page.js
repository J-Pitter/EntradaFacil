'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import PageHeader from '@/components/ui/PageHeader';
import Alert from '@/components/ui/Alert';
import FormField from '@/components/ui/FormField';
import Button from '@/components/ui/Button';

// Nombre del campo de contraseña que espera el backend.
// Si el POST responde error por "password_hash", cambia esto a 'password_hash'.
const CAMPO_CONTRASENA = 'password_hash';

export default function NuevoUsuarioPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');

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
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Escribe un correo válido (ejemplo: nombre@correo.com)');
      return;
    }
    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (!/^\d{7,15}$/.test(telefono.trim())) {
      setError('El teléfono debe tener solo números (entre 7 y 15 dígitos)');
      return;
    }

    setEnviando(true);
    try {
      await api.crear('usuarios', {
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        [CAMPO_CONTRASENA]: contrasena,
        telefono: telefono.trim(),
      });
      setExito(`Usuario "${nombre.trim()}" creado correctamente`);
      setNombre('');
      setEmail('');
      setContrasena('');
      setTelefono('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Nuevo usuario" />

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}

      <form onSubmit={manejarEnvio} className="mt-4 space-y-4">
        <FormField
          etiqueta="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <FormField
          etiqueta="Correo electrónico"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          etiqueta="Contraseña (mínimo 6 caracteres)"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <FormField
          etiqueta="Teléfono (solo números)"
          type="tel"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={enviando}>
            {enviando ? 'Guardando...' : 'Guardar'}
          </Button>
          <Link href="/usuarios" className="px-4 py-2 text-sm font-medium text-[#776d86]">
            Volver a la lista
          </Link>
        </div>
      </form>
    </div>
  );
}