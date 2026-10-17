// Traemos la conexión a la base de datos desde la carpeta config
const pool = require('../config/db');

// 1. Obtener todos los tipos de entrada
const obtenerTodos = async () => {
  // Consultamos todos los tipos de entrada ordenados por su ID
  const query = 'SELECT * FROM tipos_entrada ORDER BY id ASC;';
  const resultado = await pool.query(query);
  return resultado.rows;
};

// 2. Obtener un tipo de entrada por su ID
const obtenerPorId = async (id) => {
  // $1 se reemplaza de forma segura por el id que viene en el arreglo
  const query = 'SELECT * FROM tipos_entrada WHERE id = $1;';
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0];
};

// 3. Crear un nuevo tipo de entrada
const crear = async ({ evento_id, nombre, precio, cantidad_disponible, cantidad_vendida }) => {
  // Insertamos los campos de tipos_entrada. Si no envían cantidad_vendida, arranca en 0.
  const query = `
    INSERT INTO tipos_entrada (evento_id, nombre, precio, cantidad_disponible, cantidad_vendida)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const valores = [
    evento_id,
    nombre,
    precio,
    cantidad_disponible,
    cantidad_vendida ?? 0,
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 4. Actualizar un tipo de entrada existente
const actualizar = async (id, { evento_id, nombre, precio, cantidad_disponible, cantidad_vendida }) => {
  // Actualizamos las columnas buscando por el ID en la posición $6
  const query = `
    UPDATE tipos_entrada
    SET evento_id = $1,
        nombre = $2,
        precio = $3,
        cantidad_disponible = $4,
        cantidad_vendida = $5
    WHERE id = $6
    RETURNING *;
  `;
  const valores = [
    evento_id,
    nombre,
    precio,
    cantidad_disponible,
    cantidad_vendida ?? 0,
    id,
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 5. Eliminar un tipo de entrada por su ID
const eliminar = async (id) => {
  // Borramos el tipo de entrada y retornamos la fila eliminada
  const query = 'DELETE FROM tipos_entrada WHERE id = $1 RETURNING *;';
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

