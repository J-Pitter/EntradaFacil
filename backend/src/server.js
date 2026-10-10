require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  try {
    await pool.query('SELECT NOW()');
    console.log('Conexión a PostgreSQL exitosa');
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error.message);
  }
});