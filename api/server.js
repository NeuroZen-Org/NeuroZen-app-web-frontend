/**
 * NeuroZen API Server - Servidor Express con JSON Server para producción
 * Configurado para despliegue en Firebase Cloud Functions
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

const jsonServer = require('json-server');
const cors = require('cors');
const path = require('path');

// Crear servidor
const server = jsonServer.create();

// Configurar middlewares
server.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://neurozen-frontend.web.app',
    'https://neurozen-frontend.firebaseapp.com'
  ],
  credentials: true
}));

server.use(jsonServer.defaults());

// Cargar datos de la base de datos
const router = jsonServer.router(path.join(__dirname, 'db.json'));

// Usar el router
server.use('/api', router);

// Ruta de health check
server.get('/', (req, res) => {
  res.json({
    message: 'NeuroZen API is running',
    version: '1.0.0',
    endpoints: [
      '/api/users',
      '/api/stressData',
      '/api/stressTriggers',
      '/api/resources',
      '/api/professionals',
      '/api/appointments',
      '/api/onboarding',
      '/api/interventions',
      '/api/payments'
    ]
  });
});

// Puerto para desarrollo y producción
const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`NeuroZen API server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}`);
  console.log(`API endpoints: http://localhost:${PORT}/api`);
});
