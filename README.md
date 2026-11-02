# EntradaFácil · Guía del frontend (Tarea 3)

Esta guía explica cómo se organiza el frontend y qué debe hacer cada integrante.
**Léela completa antes de escribir código.**

## 1. Regla principal

> **No crees tus propios botones, tablas, alertas, modales ni formularios.**
> Todo lo visual ya existe en `src/components/ui/`. Úsalo.

Así toda la app se ve igual y, si hay que cambiar un estilo, se cambia en un solo archivo.

## 2. Qué ya está hecho

| Pieza | Dónde está | Para qué sirve |
|---|---|---|
| Tema y colores | `src/app/globals.css` | Colores y estilos del diseño de Figma |
| Navegación | `src/components/Navbar` | Menú superior (ya resalta la ruta activa) |
| Conexión a la API | `src/lib/api.js` | Funciones para llamar al backend |
| Área de trabajo | `src/app/page.js` | Página de inicio con 4 tarjetas |
| Componentes de UI | `src/components/ui/` | Ver tabla de abajo |

### Componentes disponibles (`src/components/ui/`)

| Componente | Úsalo para |
|---|---|
| `Button` | Todos los botones (Guardar, Cancelar, Nuevo...) |
| `PageHeader` | Título de la página y su botón de acción |
| `Alert` | Mensajes de error o de éxito |
| `FormField` | Cada campo de un formulario (etiqueta + input + error) |
| `Spinner` | Indicador de "cargando..." |
| `EmptyState` | Aviso cuando la lista está vacía |
| `Badge` | Etiquetas pequeñas (estados) |
| `DataTable` | La tabla de la lista, con Ver / Editar / Eliminar |
| `ConfirmModal` | La ventana de confirmación antes de eliminar |

Para saber qué props recibe cada uno, **abre su archivo**: están comentados y son cortos.

### Cómo se usan DataTable y ConfirmModal

```jsx
const columnas = [
  { clave: 'id_sede', titulo: 'ID' },
  { clave: 'nombre', titulo: 'Nombre' },
  { clave: 'capacidad', titulo: 'Capacidad', render: (f) => Number(f.capacidad).toLocaleString('es-CO') },
];

<DataTable
  columnas={columnas}
  filas={sedes}
  basePath="/sedes"
  idKey="id_sede"
  onEliminar={setAEliminar}
/>

<ConfirmModal
  abierto={aEliminar !== null}
  mensaje={`Se eliminará "${aEliminar?.nombre}". Esta acción no se puede deshacer.`}
  cargando={eliminando}
  onCancelar={() => setAEliminar(null)}
  onConfirmar={confirmarEliminar}
/>
```

## 3. Qué debe hacer cada integrante

Cada persona construye **un módulo completo** con sus 4 páginas, dentro de su propia carpeta:

```
src/app/<modulo>/
├── page.js                  → Lista (DataTable + modal de eliminar)
├── nuevo/page.js            → Formulario para crear
└── [id]/
    ├── page.js              → Detalle
    └── editar/page.js       → Formulario para editar
```

| Módulo | Carpeta | Responsable | Rama |
|---|---|---|---|
| Categorías (plantilla) | `src/app/categorias/` | _(nombre)_ | `feature/frontend-categorias` |
| Sedes | `src/app/sedes/` | _(nombre)_ | `feature/frontend-sedes` |
| Tipos de entrada | `src/app/tipos-entrada/` | _(nombre)_ | `feature/frontend-tipos-entrada` |
| Usuarios | `src/app/usuarios/` | _(nombre)_ | `feature/frontend-usuarios` |

**Empiecen copiando la estructura del módulo de Categorías** cuando esté en `develop`: es la plantilla de referencia.

### Cada página debe cumplir

- Usar `'use client'` si tiene estado (`useState`, `useEffect`).
- Llamar a la API **solo** con las funciones de `src/lib/api.js` (no escribir `fetch` suelto).
- Mostrar **estado de carga** (`Spinner`), **error** y **éxito** (`Alert`).
- Mostrar el `message` que devuelve la API cuando hay error.
- Mostrar `EmptyState` si la lista viene vacía.
- Eliminar siempre con `ConfirmModal`, nunca directo.
- Formatear números y fechas con `toLocaleString('es-CO')`.

### Notas por módulo

- **Tipos de entrada:** además de `/api/tipos-entrada`, pide `GET /api/eventos` para mostrar el nombre del evento y llenar el desplegable. El precio llega como texto: conviértelo con `Number()`.
- **Usuarios:** nunca muestres `password_hash`. La edición con contraseña en blanco está pendiente de decisión del grupo.
- Los IDs se muestran como número.

## 4. Flujo de trabajo con Git

Siempre desde **Git Bash**, no desde PowerShell.

```bash
git checkout develop
git pull origin develop
git checkout -b feature/frontend-<modulo>
# ... trabajas ...
git add .
git commit -m "Se creó la lista de <modulo>"
git push origin feature/frontend-<modulo>
```

Luego abre un **Pull Request hacia `develop`** en GitHub.

### Reglas

1. **Nunca** trabajes directo en `main` ni en `develop`.
2. Cada quien edita **solo su carpeta** (`src/app/<su-modulo>/`).
3. **No modifiques** `components/ui/`, `lib/api.js`, `Navbar` ni `globals.css`. Si necesitas un cambio ahí, avisa al grupo primero.
4. Commits en español y descriptivos: "Se creó...", "Se corrigió...".
5. Antes de abrir el PR, borra páginas de prueba y revisa `git status`.
6. **Nunca subas** `.env.local` ni `node_modules`.

## 5. Configuración local

1. Clona el repo y entra a `frontend/`.
2. Copia `.env.example` como `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Instala y arranca:
   ```bash
   npm install
   npm run dev
   ```
4. El frontend corre en `http://localhost:3000` y necesita el **backend encendido en el puerto 4000** (`npm run dev` en `backend/`) con la base de datos cargada.

## 6. Lista de revisión antes del PR

- [ ] Las 4 páginas del módulo funcionan (lista, nuevo, detalle, editar).
- [ ] Eliminar abre el `ConfirmModal` y muestra el error de la API si falla.
- [ ] Hay estados de carga, error y éxito.
- [ ] No hay botones, tablas ni alertas hechos a mano.
- [ ] Se ve bien en móvil (modo responsive del navegador, F12).
- [ ] No hay páginas de prueba ni `console.log` olvidados.
- [ ] `git status` no muestra `.env.local`.
- [ ] Tomé capturas de mi módulo funcionando para el informe.

## 7. Dudas

Si algo no queda claro, pregunten en el chat del grupo **antes** de inventar una solución propia.
