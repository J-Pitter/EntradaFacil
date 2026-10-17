# EntradaFacil — Backend API REST (Tarea 2 - Programación 5)

API REST desarrollada con **Node.js**, **Express.js** y **PostgreSQL** (`pg` con consultas SQL puras) implementando arquitectura de capas (`config`, `models`, `controllers`, `routes`).

---

## Estructura del Proyecto

```text
EntradaFacil/
└── backend/
    ├── database/
    │   ├── schema.sql                    # Creación de tablas, llaves y restricciones
    │   └── seed.sql                      # Datos iniciales de prueba (INSERT)
    ├── src/
    │   ├── config/
    │   │   └── db.js                     # Pool de conexión a PostgreSQL con variables de entorno
    │   ├── models/                       # Capa de acceso a datos (Consultas SQL puras)
    │   │   ├── categoriaModel.js
    │   │   ├── sedeModel.js
    │   │   ├── usuarioModel.js
    │   │   ├── tipoEntradaModel.js
    │   │   ├── organizadorModel.js
    │   │   └── eventoModel.js
    │   ├── controllers/                  # Capa de lógica y respuestas HTTP (200, 201, 400, 404, 500)
    │   │   ├── categoriaController.js
    │   │   ├── sedeController.js
    │   │   ├── usuarioController.js
    │   │   ├── tipoEntradaController.js
    │   │   ├── organizadorController.js
    │   │   └── eventoController.js
    │   ├── routes/                       # Definición de endpoints REST
    │   │   ├── categoriaRoutes.js
    │   │   ├── sedeRoutes.js
    │   │   ├── usuarioRoutes.js
    │   │   ├── tipoEntradaRoutes.js
    │   │   ├── organizadorRoutes.js
    │   │   └── eventoRoutes.js
    │   ├── app.js                        # Configuración de Express y registro de rutas
    │   └── server.js                     # Arranque del servidor y verificación de BD
    ├── .env.example                      # Plantilla de variables de entorno
    └── package.json
```

---

## Documentación de Endpoints (Lista para el Informe en PDF)

### 1. Tabla `categorias_evento` (`/api/categorias`)

#### 1.1 Consultar todas las categorías
- **Método HTTP:** `GET`
- **Ruta del endpoint:** `/api/categorias`
- **Parámetros en la URL:** Ninguno
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": [
    { "id": 1, "nombre": "Música" },
    { "id": 2, "nombre": "Deportes" }
  ],
  "message": "Categorías obtenidas correctamente"
}
```
- **Respuesta fallida (`500 Internal Server Error`):**
```json
{
  "ok": false,
  "message": "Error interno del servidor al obtener las categorías"
}
```

#### 1.2 Consultar una categoría por ID
- **Método HTTP:** `GET`
- **Ruta del endpoint:** `/api/categorias/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": { "id": 1, "nombre": "Música" },
  "message": "Categoría encontrada correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "Categoría no encontrada"
}
```

#### 1.3 Crear una categoría
- **Método HTTP:** `POST`
- **Ruta del endpoint:** `/api/categorias`
- **Parámetros en la URL:** Ninguno
- **Parámetros en el body:**
```json
{
  "nombre": "Comedia"
}
```
- **Respuesta exitosa (`201 Created`):**
```json
{
  "ok": true,
  "data": { "id": 6, "nombre": "Comedia" },
  "message": "Categoría creada exitosamente"
}
```
- **Respuesta fallida (`400 Bad Request`):**
```json
{
  "ok": false,
  "message": "El nombre de la categoría es obligatorio"
}
```

#### 1.4 Actualizar una categoría
- **Método HTTP:** `PUT`
- **Ruta del endpoint:** `/api/categorias/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:**
```json
{
  "nombre": "Stand-up Comedy"
}
```
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": { "id": 6, "nombre": "Stand-up Comedy" },
  "message": "Categoría actualizada correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "No se encontró la categoría que intentas actualizar"
}
```

#### 1.5 Eliminar una categoría
- **Método HTTP:** `DELETE`
- **Ruta del endpoint:** `/api/categorias/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": { "id": 6, "nombre": "Stand-up Comedy" },
  "message": "Categoría eliminada correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "No se encontró la categoría que intentas eliminar"
}
```

---

### 2. Tabla `sedes` (`/api/sedes`)

#### 2.1 Consultar todas las sedes
- **Método HTTP:** `GET`
- **Ruta del endpoint:** `/api/sedes`
- **Parámetros en la URL:** Ninguno
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "nombre": "Parque Central",
      "direccion": "Calle 10 # 5-20",
      "ciudad": "Bogotá",
      "capacidad": 30000
    }
  ],
  "message": "Sedes obtenidas correctamente"
}
```
- **Respuesta fallida (`500 Internal Server Error`):**
```json
{
  "ok": false,
  "message": "Error interno del servidor al obtener las sedes"
}
```

#### 2.2 Consultar una sede por ID
- **Método HTTP:** `GET`
- **Ruta del endpoint:** `/api/sedes/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 2,
    "nombre": "Estadio de la Ciudad",
    "direccion": "Carrera 15 # 20-30",
    "ciudad": "Cali",
    "capacidad": 35000
  },
  "message": "Sede encontrada correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "Sede no encontrada"
}
```

#### 2.3 Crear una sede
- **Método HTTP:** `POST`
- **Ruta del endpoint:** `/api/sedes`
- **Parámetros en la URL:** Ninguno
- **Parámetros en el body:**
```json
{
  "nombre": "Coliseo El Pueblo",
  "direccion": "Carrera 52 # 2-00",
  "ciudad": "Cali",
  "capacidad": 12000
}
```
- **Respuesta exitosa (`201 Created`):**
```json
{
  "ok": true,
  "data": {
    "id": 4,
    "nombre": "Coliseo El Pueblo",
    "direccion": "Carrera 52 # 2-00",
    "ciudad": "Cali",
    "capacidad": 12000
  },
  "message": "Sede creada exitosamente"
}
```
- **Respuesta fallida (`400 Bad Request`):**
```json
{
  "ok": false,
  "message": "La capacidad debe ser un número entero mayor a 0"
}
```

#### 2.4 Actualizar una sede
- **Método HTTP:** `PUT`
- **Ruta del endpoint:** `/api/sedes/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:**
```json
{
  "nombre": "Coliseo El Pueblo Renovado",
  "direccion": "Carrera 52 # 2-00",
  "ciudad": "Cali",
  "capacidad": 15000
}
```
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 4,
    "nombre": "Coliseo El Pueblo Renovado",
    "direccion": "Carrera 52 # 2-00",
    "ciudad": "Cali",
    "capacidad": 15000
  },
  "message": "Sede actualizada correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "No se encontró la sede que intentas actualizar"
}
```

#### 2.5 Eliminar una sede
- **Método HTTP:** `DELETE`
- **Ruta del endpoint:** `/api/sedes/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 4,
    "nombre": "Coliseo El Pueblo Renovado",
    "direccion": "Carrera 52 # 2-00",
    "ciudad": "Cali",
    "capacidad": 15000
  },
  "message": "Sede eliminada correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "No se encontró la sede que intentas eliminar"
}
```

---

### 3. Tabla `usuarios` (`/api/usuarios`)

#### 3.1 Consultar todos los usuarios
- **Método HTTP:** `GET`
- **Ruta del endpoint:** `/api/usuarios`
- **Parámetros en la URL:** Ninguno
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "nombre": "Laura Gómez",
      "email": "laura@example.com",
      "password_hash": "hash_de_prueba_1",
      "telefono": "3001112233",
      "fecha_registro": "2026-10-16T20:00:00.000Z",
      "estado": "activo"
    }
  ],
  "message": "Usuarios obtenidos correctamente"
}
```
- **Respuesta fallida (`500 Internal Server Error`):**
```json
{
  "ok": false,
  "message": "Error interno del servidor al obtener los usuarios"
}
```

#### 3.2 Consultar un usuario por ID
- **Método HTTP:** `GET`
- **Ruta del endpoint:** `/api/usuarios/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "nombre": "Laura Gómez",
    "email": "laura@example.com",
    "password_hash": "hash_de_prueba_1",
    "telefono": "3001112233",
    "fecha_registro": "2026-10-16T20:00:00.000Z",
    "estado": "activo"
  },
  "message": "Usuario encontrado correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "Usuario no encontrado"
}
```

#### 3.3 Crear un usuario
- **Método HTTP:** `POST`
- **Ruta del endpoint:** `/api/usuarios`
- **Parámetros en la URL:** Ninguno
- **Parámetros en el body:**
```json
{
  "nombre": "Andrés Felipe",
  "email": "andres@uniajc.edu.co",
  "password_hash": "hash_de_prueba_3",
  "telefono": "3150001122",
  "estado": "activo"
}
```
- **Respuesta exitosa (`201 Created`):**
```json
{
  "ok": true,
  "data": {
    "id": 3,
    "nombre": "Andrés Felipe",
    "email": "andres@uniajc.edu.co",
    "password_hash": "hash_de_prueba_3",
    "telefono": "3150001122",
    "fecha_registro": "2026-10-16T23:00:00.000Z",
    "estado": "activo"
  },
  "message": "Usuario creado exitosamente"
}
```
- **Respuesta fallida (`400 Bad Request`):**
```json
{
  "ok": false,
  "message": "Ya existe un usuario registrado con ese correo electrónico (email)"
}
```

#### 3.4 Actualizar un usuario
- **Método HTTP:** `PUT`
- **Ruta del endpoint:** `/api/usuarios/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:**
```json
{
  "nombre": "Andrés Felipe Actualizado",
  "email": "andres@uniajc.edu.co",
  "password_hash": "hash_de_prueba_3",
  "telefono": "3159998877",
  "estado": "inactivo"
}
```
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 3,
    "nombre": "Andrés Felipe Actualizado",
    "email": "andres@uniajc.edu.co",
    "password_hash": "hash_de_prueba_3",
    "telefono": "3159998877",
    "fecha_registro": "2026-10-16T23:00:00.000Z",
    "estado": "inactivo"
  },
  "message": "Usuario actualizado correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "No se encontró el usuario que intentas actualizar"
}
```

#### 3.5 Eliminar un usuario
- **Método HTTP:** `DELETE`
- **Ruta del endpoint:** `/api/usuarios/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 3,
    "nombre": "Andrés Felipe Actualizado",
    "email": "andres@uniajc.edu.co",
    "password_hash": "hash_de_prueba_3",
    "telefono": "3159998877",
    "fecha_registro": "2026-10-16T23:00:00.000Z",
    "estado": "inactivo"
  },
  "message": "Usuario eliminado correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "No se encontró el usuario que intentas eliminar"
}
```

---

### 4. Tabla `tipos_entrada` (`/api/tipos-entrada`)

#### 4.1 Consultar todos los tipos de entrada
- **Método HTTP:** `GET`
- **Ruta del endpoint:** `/api/tipos-entrada`
- **Parámetros en la URL:** Ninguno
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": [
    {
      "id": 1,
      "evento_id": 1,
      "nombre": "General",
      "precio": "89000.00",
      "cantidad_disponible": 20000,
      "cantidad_vendida": 150
    }
  ],
  "message": "Tipos de entrada obtenidos correctamente"
}
```
- **Respuesta fallida (`500 Internal Server Error`):**
```json
{
  "ok": false,
  "message": "Error interno del servidor al obtener los tipos de entrada"
}
```

#### 4.2 Consultar un tipo de entrada por ID
- **Método HTTP:** `GET`
- **Ruta del endpoint:** `/api/tipos-entrada/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 1,
    "evento_id": 1,
    "nombre": "General",
    "precio": "89000.00",
    "cantidad_disponible": 20000,
    "cantidad_vendida": 150
  },
  "message": "Tipo de entrada encontrado correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "Tipo de entrada no encontrado"
}
```

#### 4.3 Crear un tipo de entrada
- **Método HTTP:** `POST`
- **Ruta del endpoint:** `/api/tipos-entrada`
- **Parámetros en la URL:** Ninguno
- **Parámetros en el body:**
```json
{
  "evento_id": 1,
  "nombre": "Platino",
  "precio": 250000,
  "cantidad_disponible": 500,
  "cantidad_vendida": 0
}
```
- **Respuesta exitosa (`201 Created`):**
```json
{
  "ok": true,
  "data": {
    "id": 5,
    "evento_id": 1,
    "nombre": "Platino",
    "precio": "250000.00",
    "cantidad_disponible": 500,
    "cantidad_vendida": 0
  },
  "message": "Tipo de entrada creado exitosamente"
}
```
- **Respuesta fallida (`400 Bad Request`):**
```json
{
  "ok": false,
  "message": "La cantidad vendida no puede ser mayor que la cantidad disponible"
}
```

#### 4.4 Actualizar un tipo de entrada
- **Método HTTP:** `PUT`
- **Ruta del endpoint:** `/api/tipos-entrada/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:**
```json
{
  "evento_id": 1,
  "nombre": "Platino Especial",
  "precio": 270000,
  "cantidad_disponible": 500,
  "cantidad_vendida": 25
}
```
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 5,
    "evento_id": 1,
    "nombre": "Platino Especial",
    "precio": "270000.00",
    "cantidad_vendida": 25,
    "cantidad_disponible": 500
  },
  "message": "Tipo de entrada actualizado correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "No se encontró el tipo de entrada que intentas actualizar"
}
```

#### 4.5 Eliminar un tipo de entrada
- **Método HTTP:** `DELETE`
- **Ruta del endpoint:** `/api/tipos-entrada/:id`
- **Parámetros en la URL:** `id` (entero, obligatorio)
- **Parámetros en el body:** No aplica
- **Respuesta exitosa (`200 OK`):**
```json
{
  "ok": true,
  "data": {
    "id": 5,
    "evento_id": 1,
    "nombre": "Platino Especial",
    "precio": "270000.00",
    "cantidad_disponible": 500,
    "cantidad_vendida": 25
  },
  "message": "Tipo de entrada eliminado correctamente"
}
```
- **Respuesta fallida (`404 Not Found`):**
```json
{
  "ok": false,
  "message": "No se encontró el tipo de entrada que intentas eliminar"
}
```

---

### 5. Tabla `organizadores` (`/api/organizadores`) y 6. Tabla `eventos` (`/api/eventos`)

Ambas tablas cuentan también con sus 5 endpoints CRUD (`GET /`, `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`) siguiendo exactamente la misma estructura de respuesta JSON (`ok`, `data`, `message`).
