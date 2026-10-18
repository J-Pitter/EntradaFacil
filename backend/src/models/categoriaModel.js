// Traemos el pool de conexión a PostgreSQL que está en la carpeta config
const pool = require('../config/db');

// 1. Obtener todas las categorías registradas
const obtenerTodas = async () => {
  // Armamos la consulta SQL pura ordenada por ID para que no salgan en desorden
  const query = 'SELECT * FROM categorias_evento ORDER BY id ASC;';
  
  // Ejecutamos la consulta en la base de datos (usamos await porque ir a la BD toma tiempo)
  const resultado = await pool.query(query);
  
  // PostgreSQL guarda las filas encontradas dentro de la propiedad .rows
  return resultado.rows;
};

// 2. Buscar una sola categoría por su ID
const obtenerPorId = async (id) => {
  // El $1 es un marcador de posición seguro: ahí se va a inyectar el valor de [id]
  const query = 'SELECT * FROM categorias_evento WHERE id = $1;';
  
  // Le pasamos el texto del SQL y un arreglo con las variables que reemplazan los $
  const resultado = await pool.query(query, [id]);
  
  // Como buscamos por llave primaria (id), solo puede venir 1 registro (posición 0).
  // Si no existe ese ID, resultado.rows[0] devolverá undefined.
  return resultado.rows[0];
};

// 3. Crear una nueva categoría
const crear = async (nombre) => {
  // RETURNING * le dice a Postgres: "Inserta esto y devuélveme la fila completa con el ID que le asignaste"
  const query = 'INSERT INTO categorias_evento (nombre) VALUES ($1) RETURNING *;';
  
  const resultado = await pool.query(query, [nombre]);
  
  // Devolvemos la categoría recién creada
  return resultado.rows[0];
};

// 4. Actualizar una categoría existente
const actualizar = async (id, nombre) => {
  // Aquí usamos dos parámetros: $1 será el nuevo nombre y $2 será el ID que queremos modificar
  const query = 'UPDATE categorias_evento SET nombre = $1 WHERE id = $2 RETURNING *;';
  
  // ¡Ojo con el orden del arreglo! Posición 0 es $1 (nombre) y posición 1 es $2 (id)
  const resultado = await pool.query(query, [nombre, id]);
  
  // Si el ID existía, nos devuelve la fila actualizada; si no existía, devuelve undefined
  return resultado.rows[0];
};

// 5. Eliminar una categoría por su ID
const eliminar = async (id) => {
  // Borramos la fila y usamos RETURNING * para confirmar si de verdad existía y se borró
  const query = 'DELETE FROM categorias_evento WHERE id = $1 RETURNING *;';
  
  const resultado = await pool.query(query, [id]);
  
  // Devuelve la fila eliminada (o undefined si intentaron borrar un ID que no existía)
  return resultado.rows[0];
};

// Exportamos todas las funciones para que el controlador las pueda usar
module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
};

