import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import adminMiddleware from '../middleware/admin.middleware.js';

const authRoutes = Router();

// route d'inscription
authRoutes.post('/register', authController.register);

// route de connexion
authRoutes.post('/login', authController.login);

// route pour obtenir les informations de l'utilisateur connecté
authRoutes.get('/me', authMiddleware, authController.getMe);

// route pour mettre à jour le status utilisateur (seulement admin)
authRoutes.put('/status/:id', authMiddleware, adminMiddleware, authController.updateStatus);

// route pour mettre à jour le mot de passe de l'utilisateur connecté
authRoutes.put('/password', authMiddleware, authController.updatePassword);

// route pour obtenir tous les utilisateurs (seulement admin)
authRoutes.get('/users', authMiddleware, adminMiddleware, authController.getAll);

export default authRoutes;
