// Traemos el Router de Express
const express = require('express');
const router = express.Router();

// Importamos el controlador de sedes
const sedeController = require('../controllers/sedeController');

// GET /api/sedes -> Listar todas las sedes
router.get('/', sedeController.obtenerSedes);

// GET /api/sedes/:id -> Obtener una sede por ID
router.get('/:id', sedeController.obtenerSedePorId);

// POST /api/sedes -> Crear una nueva sede
router.post('/', sedeController.crearSede);

// PUT /api/sedes/:id -> Actualizar una sede por ID
router.put('/:id', sedeController.actualizarSede);

// DELETE /api/sedes/:id -> Eliminar una sede por ID
router.delete('/:id', sedeController.eliminarSede);

module.exports = router;

