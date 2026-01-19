// Importation des modules nécessaires
import { Router } from 'express';
import * as vehiculeController from '../controllers/vehicule.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const vehiculeRoutes = Router();

// Routes publiques
vehiculeRoutes.get('/', vehiculeController.getAll);
vehiculeRoutes.get('/:id', vehiculeController.getById);

// Route de création
vehiculeRoutes.post('/create', authMiddleware, adminMiddleware, vehiculeController.create);

// Route de mise à jour
vehiculeRoutes.put('/update/:id', authMiddleware, adminMiddleware, vehiculeController.updateInfo);
vehiculeRoutes.put('/status/:id', authMiddleware, adminMiddleware, vehiculeController.updateStatus);
// Route de suppression
vehiculeRoutes.delete('/delete/:id', authMiddleware, adminMiddleware, vehiculeController.remove);

export default vehiculeRoutes;