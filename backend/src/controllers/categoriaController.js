// Importamos nuestro modelo que contiene todas las consultas SQL de categorías
const categoriaModel = require('../models/categoriaModel');

// 1. Controlador para listar todas las categorías (GET /api/categorias)
const obtenerCategorias = async (req, res) => {
  try {
    // Le pedimos al modelo que traiga todas las categorías de la base de datos
    const categorias = await categoriaModel.obtenerTodas();

    // Respondemos con código 200 (OK) y la estructura JSON exacta que pide el profesor
    return res.status(200).json({
      ok: true,
      data: categorias,
      message: 'Categorías obtenidas correctamente',
    });
  } catch (error) {
    // Si la base de datos falla, imprimimos el error en consola para nosotros los devs
    console.error('Error al obtener categorías:', error);
    // Y al cliente le respondemos un 500 sin tumbar el servidor
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al obtener las categorías',
    });
  }
};

// 2. Controlador para obtener una categoría por su ID (GET /api/categorias/:id)
const obtenerCategoriaPorId = async (req, res) => {
  try {
    // Atrapamos el ID que el usuario mandó por la URL (ej: /api/categorias/5)
    const { id } = req.params;

    // Validamos que el ID sea un número válido (por si alguien escribe /api/categorias/hola)
    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID de la categoría debe ser un número válido',
      });
    }

    // Buscamos la categoría en la base de datos usando el modelo
    const categoria = await categoriaModel.obtenerPorId(id);

    // Si el modelo devuelve undefined, significa que ese ID no existe en la tabla -> Error 404
    if (!categoria) {
      return res.status(404).json({
        ok: false,
        message: 'Categoría no encontrada',
      });
    }

    // Si la encontramos, respondemos 200 (OK) con el objeto en data
    return res.status(200).json({
      ok: true,
      data: categoria,
      message: 'Categoría encontrada correctamente',
    });
  } catch (error) {
    console.error('Error al obtener categoría por ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al buscar la categoría',
    });
  }
};

// 3. Controlador para crear una nueva categoría (POST /api/categorias)
const crearCategoria = async (req, res) => {
  try {
    // Sacamos el campo "nombre" que el usuario envía en el cuerpo (body) del JSON
    const { nombre } = req.body;

    // Validamos que nos hayan mandado el nombre y que no sean solo espacios en blanco
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        ok: false,
        message: 'El nombre de la categoría es obligatorio',
      });
    }

    // Validamos que no supere los 80 caracteres que dice el VARCHAR(80) de nuestra tabla SQL
    if (nombre.trim().length > 80) {
      return res.status(400).json({
        ok: false,
        message: 'El nombre de la categoría no puede superar los 80 caracteres',
      });
    }

    // Mandamos a guardar el nombre limpio (sin espacios sobrantes al inicio o final)
    const nuevaCategoria = await categoriaModel.crear(nombre.trim());

    // Código 201 significa "Created" (Recurso creado con éxito)
    return res.status(201).json({
      ok: true,
      data: nuevaCategoria,
      message: 'Categoría creada exitosamente',
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);

    // En PostgreSQL, el código '23505' significa violación de restricción UNIQUE (nombre repetido)
    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe una categoría con ese nombre',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al crear la categoría',
    });
  }
};

// 4. Controlador para actualizar una categoría (PUT /api/categorias/:id)
const actualizarCategoria = async (req, res) => {
  try {
    // Necesitamos dos cosas: el ID que viene en la URL y el nuevo nombre que viene en el body
    const { id } = req.params;
    const { nombre } = req.body;

    // Validamos que el ID sea numérico
    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID de la categoría debe ser un número válido',
      });
    }

    // Validamos que el nuevo nombre no venga vacío
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      return res.status(400).json({
        ok: false,
        message: 'El nombre de la categoría es obligatorio para actualizar',
      });
    }

    // Validamos el límite de 80 caracteres del VARCHAR(80)
    if (nombre.trim().length > 80) {
      return res.status(400).json({
        ok: false,
        message: 'El nombre de la categoría no puede superar los 80 caracteres',
      });
    }

    // Llamamos al modelo para que haga el UPDATE en la base de datos
    const categoriaActualizada = await categoriaModel.actualizar(id, nombre.trim());

    // Si no devolvió nada, es porque intentaron editar un ID que no existe -> Error 404
    if (!categoriaActualizada) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró la categoría que intentas actualizar',
      });
    }

    // Si todo salió bien, respondemos 200 (OK) con los datos ya actualizados
    return res.status(200).json({
      ok: true,
      data: categoriaActualizada,
      message: 'Categoría actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);

    // Si intentan cambiarle el nombre por uno que ya tiene otra categoría
    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        message: 'Ya existe otra categoría con ese nombre',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al actualizar la categoría',
    });
  }
};

// 5. Controlador para eliminar una categoría (DELETE /api/categorias/:id)
const eliminarCategoria = async (req, res) => {
  try {
    // Atrapamos el ID de la URL
    const { id } = req.params;

    // Validamos que sea un número
    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID de la categoría debe ser un número válido',
      });
    }

    // Mandamos a borrar el registro en el modelo
    const categoriaEliminada = await categoriaModel.eliminar(id);

    // Si no existía ese ID, respondemos 404
    if (!categoriaEliminada) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró la categoría que intentas eliminar',
      });
    }

    // Si se borró, respondemos 200 (OK) y mostramos en data cuál fue la que se eliminó
    return res.status(200).json({
      ok: true,
      data: categoriaEliminada,
      message: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);

    // Código '23503' en Postgres es violación de llave foránea (Foreign Key):
    // pasa si intentas borrar una categoría que ya está siendo usada por algún evento.
    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'No se puede eliminar la categoría porque tiene eventos asociados',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al eliminar la categoría',
    });
  }
};

// Exportamos las funciones para conectarlas en el archivo de rutas
module.exports = {
  obtenerCategorias,
  obtenerCategoriaPorId,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};

