// Traemos el modelo de organizadores
const organizadorModel = require('../models/organizadorModel');

// 1. Obtener todos los organizadores (GET /api/organizadores)
const obtenerOrganizadores = async (req, res) => {
  try {
    const organizadores = await organizadorModel.obtenerTodos();

    return res.status(200).json({
      ok: true,
      data: organizadores,
      message: 'Organizadores obtenidos correctamente',
    });
  } catch (error) {
    console.error('Error al obtener organizadores:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al obtener los organizadores',
    });
  }
};

// 2. Obtener un organizador por su ID (GET /api/organizadores/:id)
const obtenerOrganizadorPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del organizador debe ser un número válido',
      });
    }

    const organizador = await organizadorModel.obtenerPorId(id);

    if (!organizador) {
      return res.status(404).json({
        ok: false,
        message: 'Organizador no encontrado',
      });
    }

    return res.status(200).json({
      ok: true,
      data: organizador,
      message: 'Organizador encontrado correctamente',
    });
  } catch (error) {
    console.error('Error al obtener organizador por ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al buscar el organizador',
    });
  }
};

// 3. Crear un nuevo organizador (POST /api/organizadores)
const crearOrganizador = async (req, res) => {
  try {
    const { usuario_id, nombre_empresa, descripcion, verificado } = req.body;

    // Validamos los campos obligatorios según el esquema SQL (usuario_id y nombre_empresa)
    if (usuario_id === undefined || !nombre_empresa || nombre_empresa.trim() === '') {
      return res.status(400).json({
        ok: false,
        message: 'Los campos usuario_id y nombre_empresa son obligatorios',
      });
    }

    const usuarioIdNum = Number(usuario_id);
    if (!Number.isInteger(usuarioIdNum)) {
      return res.status(400).json({
        ok: false,
        message: 'El usuario_id debe ser un número entero válido',
      });
    }

    const nuevoOrganizador = await organizadorModel.crear({
      usuario_id: usuarioIdNum,
      nombre_empresa: nombre_empresa.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      verificado: Boolean(verificado),
    });

    return res.status(201).json({
      ok: true,
      data: nuevoOrganizador,
      message: 'Organizador creado exitosamente',
    });
  } catch (error) {
    console.error('Error al crear organizador:', error);

    // Código 23505: usuario_id es UNIQUE en la tabla organizadores (un usuario solo puede tener un perfil de organizador)
    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        message: 'Este usuario ya está registrado como organizador',
      });
    }

    // Código 23503: el usuario_id enviado no existe en la tabla usuarios
    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'El usuario_id especificado no existe en la tabla de usuarios',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al crear el organizador',
    });
  }
};

// 4. Actualizar un organizador por su ID (PUT /api/organizadores/:id)
const actualizarOrganizador = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, nombre_empresa, descripcion, verificado } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del organizador debe ser un número válido',
      });
    }

    if (usuario_id === undefined || !nombre_empresa || nombre_empresa.trim() === '') {
      return res.status(400).json({
        ok: false,
        message: 'Los campos usuario_id y nombre_empresa son obligatorios',
      });
    }

    const usuarioIdNum = Number(usuario_id);
    if (!Number.isInteger(usuarioIdNum)) {
      return res.status(400).json({
        ok: false,
        message: 'El usuario_id debe ser un número entero válido',
      });
    }

    const organizadorActualizado = await organizadorModel.actualizar(id, {
      usuario_id: usuarioIdNum,
      nombre_empresa: nombre_empresa.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      verificado: Boolean(verificado),
    });

    if (!organizadorActualizado) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el organizador que intentas actualizar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: organizadorActualizado,
      message: 'Organizador actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar organizador:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        message: 'Ese usuario_id ya está asignado a otro organizador',
      });
    }

    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'El usuario_id especificado no existe en la tabla de usuarios',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al actualizar el organizador',
    });
  }
};

// 5. Eliminar un organizador por su ID (DELETE /api/organizadores/:id)
const eliminarOrganizador = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del organizador debe ser un número válido',
      });
    }

    const organizadorEliminado = await organizadorModel.eliminar(id);

    if (!organizadorEliminado) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el organizador que intentas eliminar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: organizadorEliminado,
      message: 'Organizador eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar organizador:', error);

    // En eventos dice: organizador_id REFERENCES organizadores(id) ON DELETE RESTRICT
    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'No se puede eliminar el organizador porque tiene eventos asociados',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al eliminar el organizador',
    });
  }
};

module.exports = {
  obtenerOrganizadores,
  obtenerOrganizadorPorId,
  crearOrganizador,
  actualizarOrganizador,
  eliminarOrganizador,
};

