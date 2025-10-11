/**
 * Firebase Cloud Function para NeuroZen API
 * Sirve la fake API usando json-server en Firebase Functions
 * 
 * @author Juan Carlos Angulo
 * @version 1.0.0
 */

const functions = require('firebase-functions');
const jsonServer = require('json-server');
const cors = require('cors');

// Crear app de json-server
const server = jsonServer.create();

// Configurar CORS
server.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://neurozen-frontend.web.app',
    'https://neurozen-frontend.firebaseapp.com'
  ],
  credentials: true
}));

// Middlewares por defecto
server.use(jsonServer.defaults());

// Router con la base de datos
const router = jsonServer.router('./db.json');
server.use('/api', router);

// Health check
server.get('/', (req, res) => {
  res.json({
    message: 'NeuroZen API is running on Firebase',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Exportar como Cloud Function
exports.api = functions.https.onRequest(server);
