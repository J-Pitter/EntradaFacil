// Traemos la conexión a la base de datos que está en la carpeta config
const pool = require('../config/db');

// 1. Obtener todas las sedes registradas
const obtenerTodas = async () => {
  // Traemos todas las sedes ordenadas por su ID de menor a mayor
  const query = 'SELECT * FROM sedes ORDER BY id ASC;';
  const resultado = await pool.query(query);
  return resultado.rows;
};

// 2. Obtener una sede específica por su ID
const obtenerPorId = async (id) => {
  // Usamos $1 para inyectar el ID de forma segura (evita inyección SQL)
  const query = 'SELECT * FROM sedes WHERE id = $1;';
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0];
};

// 3. Crear una nueva sede
const crear = async ({ nombre, direccion, ciudad, capacidad }) => {
  // Insertamos las 4 columnas de la tabla sedes y pedimos que nos devuelva la fila creada con RETURNING *
  const query = `
    INSERT INTO sedes (nombre, direccion, ciudad, capacidad)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const valores = [nombre, direccion, ciudad, capacidad];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 4. Actualizar una sede por su ID
const actualizar = async (id, { nombre, direccion, ciudad, capacidad }) => {
  // Actualizamos los 4 campos buscando por el ID ($5)
  const query = `
    UPDATE sedes
    SET nombre = $1,
        direccion = $2,
        ciudad = $3,
        capacidad = $4
    WHERE id = $5
    RETURNING *;
  `;
  const valores = [nombre, direccion, ciudad, capacidad, id];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 5. Eliminar una sede por su ID
const eliminar = async (id) => {
  // Borramos la sede y retornamos los datos borrados para saber si el ID existía
  const query = 'DELETE FROM sedes WHERE id = $1 RETURNING *;';
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0];
};

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};

