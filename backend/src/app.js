// Importation des modules nécessaires
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes.js';
import vehiculeRoutes from './routes/vehicule.routes.js';
import reservationRoutes from './routes/reservation.routes.js';

// Url client
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Initialisation de l’application Express
const app = express();

// Sécurité & parsing
app.use(helmet()); // Sécurise les en-têtes HTTP
app.use(cors(
  { origin: CLIENT_URL, credentials: true }
)); // Active le CORS pour toutes les routes de l’API
app.use(express.json()); // Parse le JSON dans les requêtes entrantes

// Routes
app.get('/', (_, res) => {
  res.send('Bienvenue sur le système de réservation de véhicules');
});
app.get('/api/health', (_, res) => res.send('OK'));
app.use('/api/auth', authRoutes);
app.use('/api/vehicules', vehiculeRoutes);
app.use('/api/reservations', reservationRoutes);


// Gestion des erreurs
app.use((err, _, res, __) => res.status(err.status || 500).json(err.message));

//Gestion des erreurs 404
app.use((_, res) => {
  res.status(404).send('Ressource non trouvée');
});


export default app;