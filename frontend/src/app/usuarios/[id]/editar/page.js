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

const CAMPO_CONTRASENA = 'password_hash';
const ESTADOS = ['activo', 'inactivo'];

export default function EditarUsuarioPage() {
  const { id } = useParams();

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [estado, setEstado] = useState('activo');
  const [contrasena, setContrasena] = useState('');

  const [cargando, setCargando] = useState(true);
  const [cargado, setCargado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await api.obtener('usuarios', id);
        const u = respuesta.data;
        setNombre(u.nombre);
        setEmail(u.email);
        setTelefono(u.telefono);
        setEstado(u.estado);
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
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Escribe un correo válido (ejemplo: nombre@correo.com)');
      return;
    }
    if (!/^\d{7,15}$/.test(telefono.trim())) {
      setError('El teléfono debe tener solo números (entre 7 y 15 dígitos)');
      return;
    }
    if (contrasena !== '' && contrasena.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    const datos = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono.trim(),
      estado,
    };
    if (contrasena !== '') {
      datos[CAMPO_CONTRASENA] = contrasena;
    }

    setEnviando(true);
    try {
      await api.actualizar('usuarios', id, datos);
      setExito('Usuario actualizado correctamente');
      setContrasena('');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <PageHeader titulo="Editar usuario" />

      {error && <Alert tipo="error">{error}</Alert>}
      {exito && <Alert tipo="exito">{exito}</Alert>}
      {cargando && <Spinner />}

      {cargado && (
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
            etiqueta="Teléfono (solo números)"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />

          <div>
            <label htmlFor="estado" className="mb-1 block text-sm font-medium text-[#241a36]">
              Estado
            </label>
            <select
              id="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full rounded-[10px] border border-[#e9e4f0] bg-white px-3 py-3 text-[#241a36]"
            >
              {ESTADOS.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          </div>

          <FormField
            etiqueta="Nueva contraseña (déjala en blanco para conservar la actual)"
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />

          <div className="flex gap-3">
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Link href="/usuarios" className="px-4 py-2 text-sm font-medium text-[#776d86]">
              Volver a la lista
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}