// Traemos la conexión a la base de datos desde la carpeta config
const pool = require('../config/db');

// 1. Obtener todos los eventos
const obtenerTodos = async () => {
  // Consultamos todos los eventos ordenados por su ID
  const query = 'SELECT * FROM eventos ORDER BY id ASC;';
  const resultado = await pool.query(query);
  return resultado.rows;
};

// 2. Obtener un evento por su ID
const obtenerPorId = async (id) => {
  // Buscamos el evento cuyo ID coincida con $1
  const query = 'SELECT * FROM eventos WHERE id = $1;';
  const resultado = await pool.query(query, [id]);
  return resultado.rows[0];
};

// 3. Crear un nuevo evento
const crear = async ({
  organizador_id,
  categoria_id,
  sede_id,
  titulo,
  descripcion,
  fecha_inicio,
  fecha_fin,
  estado,
}) => {
  // Insertamos todas las columnas de la tabla eventos y devolvemos la fila creada con RETURNING *
  const query = `
    INSERT INTO eventos (
      organizador_id,
      categoria_id,
      sede_id,
      titulo,
      descripcion,
      fecha_inicio,
      fecha_fin,
      estado
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;
  const valores = [
    organizador_id,
    categoria_id,
    sede_id,
    titulo,
    descripcion || null,
    fecha_inicio,
    fecha_fin || null,
    estado || 'borrador',
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 4. Actualizar un evento existente por su ID
const actualizar = async (
  id,
  {
    organizador_id,
    categoria_id,
    sede_id,
    titulo,
    descripcion,
    fecha_inicio,
    fecha_fin,
    estado,
  }
) => {
  // Actualizamos los datos del evento buscando por su ID en $9
  const query = `
    UPDATE eventos
    SET organizador_id = $1,
        categoria_id = $2,
        sede_id = $3,
        titulo = $4,
        descripcion = $5,
        fecha_inicio = $6,
        fecha_fin = $7,
        estado = $8
    WHERE id = $9
    RETURNING *;
  `;
  const valores = [
    organizador_id,
    categoria_id,
    sede_id,
    titulo,
    descripcion || null,
    fecha_inicio,
    fecha_fin || null,
    estado || 'borrador',
    id,
  ];
  const resultado = await pool.query(query, valores);
  return resultado.rows[0];
};

// 5. Eliminar un evento por su ID
const eliminar = async (id) => {
  // Borramos el evento y devolvemos el registro eliminado
  const query = 'DELETE FROM eventos WHERE id = $1 RETURNING *;';
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

