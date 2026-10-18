// Traemos el Router de Express
const express = require('express');
const router = express.Router();

// Importamos el controlador de organizadores
const organizadorController = require('../controllers/organizadorController');

// GET /api/organizadores -> Listar todos los organizadores
router.get('/', organizadorController.obtenerOrganizadores);

// GET /api/organizadores/:id -> Obtener un organizador por su ID
router.get('/:id', organizadorController.obtenerOrganizadorPorId);

// POST /api/organizadores -> Crear un nuevo organizador
router.post('/', organizadorController.crearOrganizador);

// PUT /api/organizadores/:id -> Actualizar un organizador por su ID
router.put('/:id', organizadorController.actualizarOrganizador);

// DELETE /api/organizadores/:id -> Eliminar un organizador por su ID
router.delete('/:id', organizadorController.eliminarOrganizador);

module.exports = router;

