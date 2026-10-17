// Traemos el Router de Express
const express = require('express');
const router = express.Router();

// Importamos el controlador de tipos de entrada
const tipoEntradaController = require('../controllers/tipoEntradaController');

// GET /api/tipos-entrada -> Listar todos los tipos de entrada
router.get('/', tipoEntradaController.obtenerTiposEntrada);

// GET /api/tipos-entrada/:id -> Obtener un tipo de entrada por ID
router.get('/:id', tipoEntradaController.obtenerTipoEntradaPorId);

// POST /api/tipos-entrada -> Crear un nuevo tipo de entrada
router.post('/', tipoEntradaController.crearTipoEntrada);

// PUT /api/tipos-entrada/:id -> Actualizar un tipo de entrada por ID
router.put('/:id', tipoEntradaController.actualizarTipoEntrada);

// DELETE /api/tipos-entrada/:id -> Eliminar un tipo de entrada por ID
router.delete('/:id', tipoEntradaController.eliminarTipoEntrada);

module.exports = router;

