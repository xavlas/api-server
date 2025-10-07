export const errorHandler = (err, req, res, next) => {
  console.error('Erreur:', err);

  // Erreur de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Erreur de validation',
      message: err.message,
      details: err.errors
    });
  }

  // Erreur JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token invalide',
      message: 'Token d\'authentification invalide ou malformé'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expiré',
      message: 'Votre session a expiré, veuillez vous reconnecter'
    });
  }

  // Erreur par défaut
  res.status(err.status || 500).json({
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
};