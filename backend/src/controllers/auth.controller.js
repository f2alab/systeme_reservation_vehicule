// Impotation des modules nécessaires
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, updateUserStatus, updatePasswordUser, getAllUsers } from '../models/User.js';

// Clé secrète JWT
const JWT_SECRET = process.env.JWT_SECRET || 'togo-data-lab-reservation-secret';

// Fonction utilitaire pour hacher les mots de passe
const hashPassword = async (password, saltRounds = 10) => {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
}

// Inscription utilisateur
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Nom d’utilisateur, email, mot de passe, et rôle sont requis.' });
    }

    const existingUser = await findUserByEmail(req.app.get('db'), email);
    if (existingUser) {
      return res.status(409).json({ error: 'Un utilisateur avec cet email existe déjà.' });
    }

    const hashedPassword = await hashPassword(password, 10);
    const user = await createUser(req.app.get('db'), { name, email, password: hashedPassword, role });

    // Ne renvoie pas le mot de passe
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Erreur inscription:', error);
    res.status(500).json({ error: 'Erreur serveur lors de l’inscription.' });
  }
};

// Connexion utilisateur
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = await findUserByEmail(req.app.get('db'), email);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
  } catch (error) {
    console.error('Erreur connexion:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la connexion.' });
  }
};

// Obtenir les informations de l'utilisateur connecté
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token décodé
    const user = await findUserById(req.app.get('db'), userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur obtenir utilisateur:', error);
    res.status(500).json({ error: 'Impossible de obtenir l’utilisateur.' });
  }
};

// Mise à jour du mot de passe de l'utilisateur connecté
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id; // Récupérer l'ID utilisateur depuis le token décodé
    const { password } = req.body;
    const hashedPassword = await hashPassword(password, 10);
    const user = await updatePasswordUser(req.app.get('db'), userId, hashedPassword);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non rencontré.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur mise à jour mot de passe:', error);
    res.status(500).json({ error: 'Impossible de mettre à jour le mot de passe.' });
  }
};

// Mise à jour du statut de l'utilisateur (admin seulement)
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await updateUserStatus(req.app.get('db'), id, status);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non rencontré.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur mise à jour statut utilisateur:', error);
    res.status(500).json({ error: 'Impossible de mettre à jour le statut de l’utilisateur.' });
  }
};

// Obtenir tous les utilisateurs (admin seulement)
export const getAll = async (req, res) => {
  try {
    const users = await getAllUsers(req.app.get('db'));
    // Transformer les données pour correspondre à l'interface User
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }));
    res.json(transformedUsers);
  } catch (error) {
    console.error('Erreur obtenir tous les utilisateurs:', error);
    res.status(500).json({ error: 'Impossible de récupérer les utilisateurs.' });
  }
};
