// Importation des modules nécessaires
import { Router } from 'express';
import * as reservationController from '../controllers/reservation.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const reservationRoutes = Router();

// Toutes les routes de réservation nécessitent une authentification
reservationRoutes.post('/create', authMiddleware, reservationController.create);
reservationRoutes.get('/user', authMiddleware, reservationController.getUserReservations);
reservationRoutes.put('/cancel/:id', authMiddleware, reservationController.cancel);
// routes admin seulement
reservationRoutes.put('/approve/:id', authMiddleware, adminMiddleware, reservationController.approve);
reservationRoutes.put('/disapprove/:id', authMiddleware, adminMiddleware, reservationController.disapprove);
// recupérer toutes les réservations (pour admin, par exemple)
reservationRoutes.get('/all', authMiddleware, adminMiddleware, reservationController.getAllReservationsWithDetails);

export default reservationRoutes;
