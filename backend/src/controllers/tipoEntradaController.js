// Importamos el modelo de tipos de entrada
const tipoEntradaModel = require('../models/tipoEntradaModel');

// 1. Obtener todos los tipos de entrada (GET /api/tipos-entrada)
const obtenerTiposEntrada = async (req, res) => {
  try {
    const tipos = await tipoEntradaModel.obtenerTodos();

    return res.status(200).json({
      ok: true,
      data: tipos,
      message: 'Tipos de entrada obtenidos correctamente',
    });
  } catch (error) {
    console.error('Error al obtener tipos de entrada:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al obtener los tipos de entrada',
    });
  }
};

// 2. Obtener un tipo de entrada por su ID (GET /api/tipos-entrada/:id)
const obtenerTipoEntradaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del tipo de entrada debe ser un número válido',
      });
    }

    const tipo = await tipoEntradaModel.obtenerPorId(id);

    if (!tipo) {
      return res.status(404).json({
        ok: false,
        message: 'Tipo de entrada no encontrado',
      });
    }

    return res.status(200).json({
      ok: true,
      data: tipo,
      message: 'Tipo de entrada encontrado correctamente',
    });
  } catch (error) {
    console.error('Error al obtener tipo de entrada por ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al buscar el tipo de entrada',
    });
  }
};

// 3. Crear un nuevo tipo de entrada (POST /api/tipos-entrada)
const crearTipoEntrada = async (req, res) => {
  try {
    const { evento_id, nombre, precio, cantidad_disponible, cantidad_vendida } = req.body;

    // Validamos que los campos obligatorios vengan en el JSON
    if (
      evento_id === undefined ||
      !nombre ||
      precio === undefined ||
      cantidad_disponible === undefined
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos evento_id, nombre, precio y cantidad_disponible son obligatorios',
      });
    }

    // Convertimos a número para validar todas las reglas CHECK de nuestra tabla SQL
    const eventoIdNum = Number(evento_id);
    const precioNum = Number(precio);
    const disponibleNum = Number(cantidad_disponible);
    const vendidaNum = cantidad_vendida !== undefined ? Number(cantidad_vendida) : 0;

    if (!Number.isInteger(eventoIdNum) || isNaN(precioNum) || !Number.isInteger(disponibleNum) || !Number.isInteger(vendidaNum)) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos numéricos (evento_id, precio, cantidad_disponible, cantidad_vendida) deben ser números válidos',
      });
    }

    // Validamos CHECK (precio >= 0), CHECK (cantidad_disponible >= 0) y CHECK (cantidad_vendida >= 0)
    if (precioNum < 0 || disponibleNum < 0 || vendidaNum < 0) {
      return res.status(400).json({
        ok: false,
        message: 'El precio y las cantidades no pueden ser números negativos',
      });
    }

    // Validamos CHECK (cantidad_vendida <= cantidad_disponible)
    if (vendidaNum > disponibleNum) {
      return res.status(400).json({
        ok: false,
        message: 'La cantidad vendida no puede ser mayor que la cantidad disponible',
      });
    }

    const nuevoTipo = await tipoEntradaModel.crear({
      evento_id: eventoIdNum,
      nombre: nombre.trim(),
      precio: precioNum,
      cantidad_disponible: disponibleNum,
      cantidad_vendida: vendidaNum,
    });

    return res.status(201).json({
      ok: true,
      data: nuevoTipo,
      message: 'Tipo de entrada creado exitosamente',
    });
  } catch (error) {
    console.error('Error al crear tipo de entrada:', error);

    // Código '23505' es violación de UNIQUE (evento_id, nombre):
    // significa que ese mismo evento ya tiene un tipo de entrada con ese nombre (ej: dos 'VIP' en el evento 1)
    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        message: 'Este evento ya tiene un tipo de entrada con ese nombre',
      });
    }

    // Código '23503' es violación de llave foránea: significa que el evento_id enviado no existe en la tabla eventos
    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'El evento_id especificado no existe',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al crear el tipo de entrada',
    });
  }
};

// 4. Actualizar un tipo de entrada (PUT /api/tipos-entrada/:id)
const actualizarTipoEntrada = async (req, res) => {
  try {
    const { id } = req.params;
    const { evento_id, nombre, precio, cantidad_disponible, cantidad_vendida } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del tipo de entrada debe ser un número válido',
      });
    }

    if (
      evento_id === undefined ||
      !nombre ||
      precio === undefined ||
      cantidad_disponible === undefined
    ) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos evento_id, nombre, precio y cantidad_disponible son obligatorios',
      });
    }

    const eventoIdNum = Number(evento_id);
    const precioNum = Number(precio);
    const disponibleNum = Number(cantidad_disponible);
    const vendidaNum = cantidad_vendida !== undefined ? Number(cantidad_vendida) : 0;

    if (!Number.isInteger(eventoIdNum) || isNaN(precioNum) || !Number.isInteger(disponibleNum) || !Number.isInteger(vendidaNum)) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos numéricos deben ser números válidos',
      });
    }

    if (precioNum < 0 || disponibleNum < 0 || vendidaNum < 0) {
      return res.status(400).json({
        ok: false,
        message: 'El precio y las cantidades no pueden ser números negativos',
      });
    }

    if (vendidaNum > disponibleNum) {
      return res.status(400).json({
        ok: false,
        message: 'La cantidad vendida no puede ser mayor que la cantidad disponible',
      });
    }

    const tipoActualizado = await tipoEntradaModel.actualizar(id, {
      evento_id: eventoIdNum,
      nombre: nombre.trim(),
      precio: precioNum,
      cantidad_disponible: disponibleNum,
      cantidad_vendida: vendidaNum,
    });

    if (!tipoActualizado) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el tipo de entrada que intentas actualizar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: tipoActualizado,
      message: 'Tipo de entrada actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar tipo de entrada:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        ok: false,
        message: 'Este evento ya tiene otro tipo de entrada con ese nombre',
      });
    }

    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'El evento_id especificado no existe',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al actualizar el tipo de entrada',
    });
  }
};

// 5. Eliminar un tipo de entrada por su ID (DELETE /api/tipos-entrada/:id)
const eliminarTipoEntrada = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del tipo de entrada debe ser un número válido',
      });
    }

    const tipoEliminado = await tipoEntradaModel.eliminar(id);

    if (!tipoEliminado) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el tipo de entrada que intentas eliminar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: tipoEliminado,
      message: 'Tipo de entrada eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar tipo de entrada:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al eliminar el tipo de entrada',
    });
  }
};

module.exports = {
  obtenerTiposEntrada,
  obtenerTipoEntradaPorId,
  crearTipoEntrada,
  actualizarTipoEntrada,
  eliminarTipoEntrada,
};

