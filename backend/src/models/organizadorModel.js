// Traemos la conexión a la base de datos desde la carpeta config
const pool = require('../config/db');

// 1. Obtener todos los organizadores
const obtenerTodos = async () => {
  // Traemos todos los organizadores ordenados por su ID
  const query = 'SELECT * FROM organizadores ORDER BY id ASC;';
  const resultado = await pool.query(query);
  return resultado.rows;
};

// 2. Obtener un organizador por su ID
const obtenerPorId = async (id) => {
  // Buscamos el organizador por su llave primaria de forma segura con $1
  const query = 'SELECT * FROM organizadores WHERE id = $1;';
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0];
};

// 3. Crear un nuevo organizador
const crear = async ({ usuario_id, nombre_empresa, descripcion, verificado }) => {
  // Insertamos los datos y con RETURNING * devolvemos el registro recién creado
  const query = `
    INSERT INTO organizadores (usuario_id, nombre_empresa, descripcion, verificado)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const valores = [
    usuario_id,
    nombre_empresa,
    descripcion || null,
    verificado ?? false,
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 4. Actualizar un organizador existente por su ID
const actualizar = async (id, { usuario_id, nombre_empresa, descripcion, verificado }) => {
  // Actualizamos las columnas del organizador cuyo id sea $5
  const query = `
    UPDATE organizadores
    SET usuario_id = $1,
        nombre_empresa = $2,
        descripcion = $3,
        verificado = $4
    WHERE id = $5
    RETURNING *;
  `;
  const valores = [
    usuario_id,
    nombre_empresa,
    descripcion || null,
    verificado ?? false,
    id,
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 5. Eliminar un organizador por su ID
const eliminar = async (id) => {
  // Borramos el organizador y retornamos la fila eliminada para confirmar que existía
  const query = 'DELETE FROM organizadores WHERE id = $1 RETURNING *;';
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

