// Importamos el modelo de usuarios
const usuarioModel = require('../models/usuarioModel');

// 1. Obtener todos los usuarios (GET /api/usuarios)
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioModel.obtenerTodos();

    return res.status(200).json({
      ok: true,
      data: usuarios,
      message: 'Usuarios obtenidos correctamente',
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al obtener los usuarios',
    });
  }
};

// 2. Obtener un usuario por su ID (GET /api/usuarios/:id)
const obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del usuario debe ser un número válido',
      });
    }

    const usuario = await usuarioModel.obtenerPorId(id);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado',
      });
    }

    return res.status(200).json({
      ok: true,
      data: usuario,
      message: 'Usuario encontrado correctamente',
    });
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al buscar el usuario',
    });
  }
};

// 3. Crear un nuevo usuario (POST /api/usuarios)
const crearUsuario = async (req, res) => {
  try {
    // Extraemos los campos según la tabla usuarios.
    // Recuerda: como en esta entrega no hay encriptación, password_hash se recibe como texto normal.
    const { nombre, email, password_hash, telefono, estado } = req.body;

    // Validamos los campos que son NOT NULL en la base de datos
    if (!nombre || !email || !password_hash) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos nombre, email y password_hash son obligatorios',
      });
    }

    // Validamos el CHECK (estado IN ('activo', 'inactivo')) de nuestra tabla SQL
    if (estado && estado !== 'activo' && estado !== 'inactivo') {
      return res.status(400).json({
        ok: false,
        message: "El estado solo puede ser 'activo' o 'inactivo'",
      });
    }

    const nuevoUsuario = await usuarioModel.crear({
      nombre: nombre.trim(),
      email: email.trim(),
      password_hash,
      telefono: telefono ? telefono.trim() : null,
      estado: estado || 'activo',
    });

    return res.status(201).json({
      ok: true,
      data: nuevoUsuario,
      message: 'Usuario creado exitosamente',
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);

    // Código '23505' significa que el email ya está registrado (porque email es UNIQUE)
    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe un usuario registrado con ese correo electrónico (email)',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al crear el usuario',
    });
  }
};

// 4. Actualizar un usuario por su ID (PUT /api/usuarios/:id)
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password_hash, telefono, estado } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del usuario debe ser un número válido',
      });
    }

    if (!nombre || !email || !password_hash) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos nombre, email y password_hash son obligatorios',
      });
    }

    if (estado && estado !== 'activo' && estado !== 'inactivo') {
      return res.status(400).json({
        ok: false,
        message: "El estado solo puede ser 'activo' o 'inactivo'",
      });
    }

    const usuarioActualizado = await usuarioModel.actualizar(id, {
      nombre: nombre.trim(),
      email: email.trim(),
      password_hash,
      telefono: telefono ? telefono.trim() : null,
      estado: estado || 'activo',
    });

    if (!usuarioActualizado) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el usuario que intentas actualizar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: usuarioActualizado,
      message: 'Usuario actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        message: 'Ese correo electrónico (email) ya pertenece a otro usuario',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al actualizar el usuario',
    });
  }
};

// 5. Eliminar un usuario por su ID (DELETE /api/usuarios/:id)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del usuario debe ser un número válido',
      });
    }

    const usuarioEliminado = await usuarioModel.eliminar(id);

    if (!usuarioEliminado) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el usuario que intentas eliminar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: usuarioEliminado,
      message: 'Usuario eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'No se puede eliminar el usuario porque tiene registros asociados',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al eliminar el usuario',
    });
  }
};

module.exports = {
  obtenerUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
};

