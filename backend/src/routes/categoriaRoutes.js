// Traemos Express para poder usar su sistema de rutas (Router)
const express = require('express');
const router = express.Router();

// Importamos las funciones de nuestro controlador de categorías
const categoriaController = require('../controllers/categoriaController');

// Definimos los 5 endpoints del CRUD:
// Nota: como en app.js se monta en '/api/categorias', aquí solo ponemos '/' o '/:id'

// GET /api/categorias -> Trae todas las categorías
router.get('/', categoriaController.obtenerCategorias);

// GET /api/categorias/:id -> Trae una sola categoría según su ID
router.get('/:id', categoriaController.obtenerCategoriaPorId);

// POST /api/categorias -> Crea una categoría nueva
router.post('/', categoriaController.crearCategoria);

// PUT /api/categorias/:id -> Actualiza una categoría existente por su ID
router.put('/:id', categoriaController.actualizarCategoria);

// DELETE /api/categorias/:id -> Elimina una categoría por su ID
router.delete('/:id', categoriaController.eliminarCategoria);

// Exportamos el router para conectarlo en app.js
module.exports = router;

