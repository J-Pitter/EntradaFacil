// Importamos el modelo de eventos
const eventoModel = require('../models/eventoModel');

// Lista de estados permitidos según el CHECK de la tabla eventos en PostgreSQL
const ESTADOS_VALIDOS = ['borrador', 'publicado', 'finalizado', 'cancelado'];

// 1. Obtener todos los eventos (GET /api/eventos)
const obtenerEventos = async (req, res) => {
  try {
    const eventos = await eventoModel.obtenerTodos();

    return res.status(200).json({
      ok: true,
      data: eventos,
      message: 'Eventos obtenidos correctamente',
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al obtener los eventos',
    });
  }
};

// 2. Obtener un evento por su ID (GET /api/eventos/:id)
const obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del evento debe ser un número válido',
      });
    }

    const evento = await eventoModel.obtenerPorId(id);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        message: 'Evento no encontrado',
      });
    }

    return res.status(200).json({
      ok: true,
      data: evento,
      message: 'Evento encontrado correctamente',
    });
  } catch (error) {
    console.error('Error al obtener evento por ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al buscar el evento',
    });
  }
};

// 3. Crear un nuevo evento (POST /api/eventos)
const crearEvento = async (req, res) => {
  try {
    const {
      organizador_id,
      categoria_id,
      sede_id,
      titulo,
      descripcion,
      fecha_inicio,
      fecha_fin,
      estado,
    } = req.body;

    // Validamos los campos que son NOT NULL en la tabla eventos
    if (
      organizador_id === undefined ||
      categoria_id === undefined ||
      sede_id === undefined ||
      !titulo ||
      !fecha_inicio
    ) {
      return res.status(400).json({
        ok: false,
        message:
          'Los campos organizador_id, categoria_id, sede_id, titulo y fecha_inicio son obligatorios',
      });
    }

    // Validamos el estado contra los 4 valores permitidos en el CHECK
    if (estado && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        ok: false,
        message: "El estado debe ser 'borrador', 'publicado', 'finalizado' o 'cancelado'",
      });
    }

    // Validamos CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
    if (fecha_fin && new Date(fecha_fin) < new Date(fecha_inicio)) {
      return res.status(400).json({
        ok: false,
        message: 'La fecha_fin no puede ser anterior a la fecha_inicio',
      });
    }

    const nuevoEvento = await eventoModel.crear({
      organizador_id: Number(organizador_id),
      categoria_id: Number(categoria_id),
      sede_id: Number(sede_id),
      titulo: titulo.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      fecha_inicio,
      fecha_fin: fecha_fin || null,
      estado: estado || 'borrador',
    });

    return res.status(201).json({
      ok: true,
      data: nuevoEvento,
      message: 'Evento creado exitosamente',
    });
  } catch (error) {
    console.error('Error al crear evento:', error);

    // Código 23503: alguna llave foránea (organizador_id, categoria_id o sede_id) no existe
    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'El organizador_id, categoria_id o sede_id especificado no existe',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al crear el evento',
    });
  }
};

// 4. Actualizar un evento existente (PUT /api/eventos/:id)
const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      organizador_id,
      categoria_id,
      sede_id,
      titulo,
      descripcion,
      fecha_inicio,
      fecha_fin,
      estado,
    } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del evento debe ser un número válido',
      });
    }

    if (
      organizador_id === undefined ||
      categoria_id === undefined ||
      sede_id === undefined ||
      !titulo ||
      !fecha_inicio
    ) {
      return res.status(400).json({
        ok: false,
        message:
          'Los campos organizador_id, categoria_id, sede_id, titulo y fecha_inicio son obligatorios',
      });
    }

    if (estado && !ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        ok: false,
        message: "El estado debe ser 'borrador', 'publicado', 'finalizado' o 'cancelado'",
      });
    }

    if (fecha_fin && new Date(fecha_fin) < new Date(fecha_inicio)) {
      return res.status(400).json({
        ok: false,
        message: 'La fecha_fin no puede ser anterior a la fecha_inicio',
      });
    }

    const eventoActualizado = await eventoModel.actualizar(id, {
      organizador_id: Number(organizador_id),
      categoria_id: Number(categoria_id),
      sede_id: Number(sede_id),
      titulo: titulo.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      fecha_inicio,
      fecha_fin: fecha_fin || null,
      estado: estado || 'borrador',
    });

    if (!eventoActualizado) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el evento que intentas actualizar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: eventoActualizado,
      message: 'Evento actualizado correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);

    if (error.code === '23503') {
      return res.status(400).json({
        ok: false,
        message: 'El organizador_id, categoria_id o sede_id especificado no existe',
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al actualizar el evento',
    });
  }
};

// 5. Eliminar un evento por su ID (DELETE /api/eventos/:id)
const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        ok: false,
        message: 'El ID del evento debe ser un número válido',
      });
    }

    const eventoEliminado = await eventoModel.eliminar(id);

    if (!eventoEliminado) {
      return res.status(404).json({
        ok: false,
        message: 'No se encontró el evento que intentas eliminar',
      });
    }

    return res.status(200).json({
      ok: true,
      data: eventoEliminado,
      message: 'Evento eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor al eliminar el evento',
    });
  }
};

module.exports = {
  obtenerEventos,
  obtenerEventoPorId,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};

