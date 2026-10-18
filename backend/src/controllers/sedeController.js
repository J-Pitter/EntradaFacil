// Importamos el modelo de sedes para hacer las consultas a la base de datos
const sedeModel = require('../models/sedeModel');

// 1. Listar todas las sedes (GET /api/sedes)
const obtenerSedes = async (req, res) => {
  try {
    const sedes = await sedeModel.obtenerTodas();

    return res.status(200).json({
      ok: true,
      data: sedes,
      message: 'Sedes obtenidas correctamente',
    });
  } catch (error) {
    console.error('Error al obtener sedes:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al obtener las sedes',
    });
  }
};

// 2. Obtener una sede por su ID (GET /api/sedes/:id)
const obtenerSedePorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Validamos que el ID enviado en la URL sea un número
    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID de la sede debe ser un número válido',
      });
    }

    const sede = await sedeModel.obtenerPorId(id);

    // Si no existe esa sede, devolvemos 404 Not Found
    if (!sede) {
      return res.status(404).json({
        ok: false,
        message: 'Sede no encontrada',
      });
    }

    return res.status(200).json({
      ok: true,
      data: sede,
      message: 'Sede encontrada correctamente',
    });
  } catch (error) {
    console.error('Error al obtener sede por ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al buscar la sede',
    });
  }
};

// 3. Crear una nueva sede (POST /api/sedes)
const crearSede = async (req, res) => {
  try {
    // Extraemos los 4 campos de la tabla sedes desde el body
    const { nombre, direccion, ciudad, capacidad } = req.body;

    // Validamos que ningún campo obligatorio venga vacío
    if (!nombre || !direccion || !ciudad || capacidad === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos (nombre, direccion, ciudad y capacidad) son obligatorios',
      });
    }

    // En el SQL dice: capacidad INT NOT NULL CHECK (capacidad > 0)
    // Así que verificamos que capacidad sea un número entero mayor a cero
    const capacidadNumero = Number(capacidad);
    if (!Number.isInteger(capacidadNumero) || capacidadNumero <= 0) {
      return res.status(400).json({
        ok: false,
        message: 'La capacidad debe ser un número entero mayor a 0',
      });
    }

    // Mandamos a crear la sede en el modelo
    const nuevaSede = await sedeModel.crear({
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      capacidad: capacidadNumero,
    });

    // Respondemos 201 Created
    return res.status(201).json({
      ok: true,
      data: nuevaSede,
      message: 'Sede creada exitosamente',
    });
  } catch (error) {
    console.error('Error al crear sede:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al crear la sede',
    });
  }
};

// 4. Actualizar una sede existente (PUT /api/sedes/:id)
const actualizarSede = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, ciudad, capacidad } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID de la sede debe ser un número válido',
      });
    }

    if (!nombre || !direccion || !ciudad || capacidad === undefined) {
      return res.status(400).json({
        ok: false,
        message: 'Todos los campos (nombre, direccion, ciudad y capacidad) son obligatorios',
      });
    }

    const capacidadNumero = Number(capacidad);
    if (!Number.isInteger(capacidadNumero) || capacidadNumero <= 0) {
      return res.status(400).json({
        ok: false,
        message: 'La capacidad debe ser un número entero mayor a 0',
      });
    }

    const sedeActualizada = await sedeModel.actualizar(id, {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      ciudad: ciudad.trim(),
      capacidad: capacidadNumero,
    });

    // Si no encontró el ID para actualizar, devolvemos 404
    if (!sedeActualizada) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró la sede que intentas actualizar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: sedeActualizada,
      message: 'Sede actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar sede:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al actualizar la sede',
    });
  }
};

// 5. Eliminar una sede por su ID (DELETE /api/sedes/:id)
const eliminarSede = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID de la sede debe ser un número válido',
      });
    }

    const sedeEliminada = await sedeModel.eliminar(id);

    if (!sedeEliminada) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró la sede que intentas eliminar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: sedeEliminada,
      message: 'Sede eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar sede:', error);

    // Si la sede ya está amarrada a un evento, PostgreSQL lanza el error 23503 (ON DELETE RESTRICT)
    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'No se puede eliminar la sede porque tiene eventos asociados',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al eliminar la sede',
    });
  }
};

module.exports = {
  obtenerSedes,
  obtenerSedePorId,
  crearSede,
  actualizarSede,
  eliminarSede,
};

