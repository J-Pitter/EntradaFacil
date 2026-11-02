const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Ocurrió un error');
  return json;
}

export const api = {
  listar: (r) => request(`/api/${r}`),
  obtener: (r, id) => request(`/api/${r}/${id}`),
  crear: (r, datos) => request(`/api/${r}`, { method: 'POST', body: JSON.stringify(datos) }),
  actualizar: (r, id, datos) => request(`/api/${r}/${id}`, { method: 'PUT', body: JSON.stringify(datos) }),
  eliminar: (r, id) => request(`/api/${r}/${id}`, { method: 'DELETE' }),
};