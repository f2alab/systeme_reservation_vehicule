const adminMiddleware = (req, res, next) => {
  // Vérifier que l'utilisateur est authentifié (injecté par authMiddleware)
  if (!req.user) {
    return res.status(401).json({ error: 'Authentification requise.' });
  }

  // Vérifier que le rôle est 'admin'
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: `Vous n'êtes pas autorisé à effectuer cette opération.` });
  }

  next();
};

export default adminMiddleware;