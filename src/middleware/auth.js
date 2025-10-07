import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import { userDb } from '../utils/database.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    const decoded = verifyToken(token);
    
    // Vérifier que l'utilisateur existe toujours
    const user = userDb.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Utilisateur non trouvé ou désactivé'
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Token d\'authentification invalide',
      message: error.message
    });
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentification requise'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Permissions insuffisantes',
        message: `Rôle requis: ${allowedRoles.join(' ou ')}, rôle actuel: ${userRole}`
      });
    }

    next();
  };
};