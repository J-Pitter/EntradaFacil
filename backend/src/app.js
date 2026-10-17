const express = require('express');
const cors = require('cors');

// Importamos las rutas de todas las tablas de nuestra base de datos
const categoriaRoutes = require('./routes/categoriaRoutes');
const sedeRoutes = require('./routes/sedeRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const tipoEntradaRoutes = require('./routes/tipoEntradaRoutes');
const organizadorRoutes = require('./routes/organizadorRoutes');
const eventoRoutes = require('./routes/eventoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'API funcionando' });
});

// Aquí cada integrante registrará la ruta de su tabla:
app.use('/api/eventos', eventoRoutes);
app.use('/api/organizadores', organizadorRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/sedes', sedeRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/tipos-entrada', tipoEntradaRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ ok: false, message: 'Error interno del servidor' });
});

module.exports = app;