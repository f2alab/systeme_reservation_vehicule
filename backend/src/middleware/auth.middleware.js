// Importation des modules nécessaires
import jwt from 'jsonwebtoken';

// Clé secrète JWT
const JWT_SECRET = process.env.JWT_SECRET || 'togo-data-lab-reservation-secret';
console.log(`JW_SECRET: ${JWT_SECRET}`)

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    // return res.status(401).json({ error: 'Accès refusé : token manquant.' });
    return res.status(401).json({ error: 'Accès refusé' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token invalide ou expiré.' });
    }
    req.user = user; 
    next();
  });
};

export default authMiddleware;