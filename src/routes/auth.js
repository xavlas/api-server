import express from 'express';
import { body } from 'express-validator';
import { login, register, refreshToken, logout, changePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Validation pour la connexion
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

// Validation pour l'inscription
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('Le prénom est requis')
    .isLength({ max: 50 })
    .withMessage('Le prénom ne peut pas dépasser 50 caractères'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Le nom est requis')
    .isLength({ max: 50 })
    .withMessage('Le nom ne peut pas dépasser 50 caractères')
];

// Validation pour le changement de mot de passe
const changePasswordValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Mot de passe actuel requis'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
];

// Routes publiques
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);

// Routes protégées (nécessitent une authentification)
router.post('/refresh', authenticateToken, refreshToken);
router.post('/logout', authenticateToken, logout);
router.post('/change-password', authenticateToken, changePasswordValidation, changePassword);

// Route de test pour vérifier l'authentification
router.get('/me', authenticateToken, (req, res) => {
  res.json({
    message: 'Authentification réussie',
    user: req.user
  });
});

export default router;