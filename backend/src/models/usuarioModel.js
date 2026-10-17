// Traemos la conexión a la base de datos desde la carpeta config
const pool = require('../config/db');

// 1. Obtener todos los usuarios registrados
const obtenerTodos = async () => {
  // Consultamos todos los usuarios ordenados por ID
  const query = 'SELECT * FROM usuarios ORDER BY id ASC;';
  const resultado = await pool.query(query);
  return resultado.rows;
};

// 2. Obtener un solo usuario por su ID
const obtenerPorId = async (id) => {
  // Buscamos el usuario cuyo ID coincida con el parámetro $1
  const query = 'SELECT * FROM usuarios WHERE id = $1;';
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0];
};

// 3. Crear un nuevo usuario
const crear = async ({ nombre, email, password_hash, telefono, estado }) => {
  // Nota: fecha_registro se llena sola en Postgres gracias al DEFAULT NOW().
  // Para estado, si no nos lo envían, le ponemos 'activo' por defecto.
  const query = `
    INSERT INTO usuarios (nombre, email, password_hash, telefono, estado)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const valores = [
    nombre,
    email,
    password_hash,
    telefono || null,
    estado || 'activo',
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 4. Actualizar un usuario existente por su ID
const actualizar = async (id, { nombre, email, password_hash, telefono, estado }) => {
  // Actualizamos los datos del usuario identificado con el ID en $6
  const query = `
    UPDATE usuarios
    SET nombre = $1,
        email = $2,
        password_hash = $3,
        telefono = $4,
        estado = $5
    WHERE id = $6
    RETURNING *;
  `;
  const valores = [
    nombre,
    email,
    password_hash,
    telefono || null,
    estado || 'activo',
    id,
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 5. Eliminar un usuario por su ID
const eliminar = async (id) => {
  // Eliminamos el registro y con RETURNING * verificamos si existía
  const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING *;';
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0];
};

module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};

