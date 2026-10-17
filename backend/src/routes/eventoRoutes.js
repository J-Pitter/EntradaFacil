// Traemos el Router de Express
const express = require('express');
const router = express.Router();

// Importamos el controlador de eventos
const eventoController = require('../controllers/eventoController');

// GET /api/eventos -> Listar todos los eventos
router.get('/', eventoController.obtenerEventos);

// GET /api/eventos/:id -> Obtener un evento por su ID
router.get('/:id', eventoController.obtenerEventoPorId);

// POST /api/eventos -> Crear un nuevo evento
router.post('/', eventoController.crearEvento);

// PUT /api/eventos/:id -> Actualizar un evento por su ID
router.put('/:id', eventoController.actualizarEvento);

// DELETE /api/eventos/:id -> Eliminar un evento por su ID
router.delete('/:id', eventoController.eliminarEvento);

module.exports = router;

