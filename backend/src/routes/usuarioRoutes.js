// Traemos el Router de Express
const express = require('express');
const router = express.Router();

// Importamos el controlador de usuarios
const usuarioController = require('../controllers/usuarioController');

// GET /api/usuarios -> Listar todos los usuarios
router.get('/', usuarioController.obtenerUsuarios);

// GET /api/usuarios/:id -> Obtener un usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// POST /api/usuarios -> Crear un nuevo usuario
router.post('/', usuarioController.crearUsuario);

// PUT /api/usuarios/:id -> Actualizar un usuario por ID
router.put('/:id', usuarioController.actualizarUsuario);

// DELETE /api/usuarios/:id -> Eliminar un usuario por ID
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;

