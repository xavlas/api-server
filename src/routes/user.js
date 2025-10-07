import express from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, deleteAccount, getAllUsers, getUserStats } from '../controllers/userController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Validation pour la mise à jour du profil
const updateProfileValidation = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Le prénom ne peut pas être vide')
    .isLength({ max: 50 })
    .withMessage('Le prénom ne peut pas dépasser 50 caractères'),
  body('lastName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Le nom ne peut pas être vide')
    .isLength({ max: 50 })
    .withMessage('Le nom ne peut pas dépasser 50 caractères'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('URL d\'avatar invalide')
];

// Routes utilisateur (toutes nécessitent une authentification)
router.use(authenticateToken);

// Profil utilisateur
router.get('/profile', getProfile);
router.put('/profile', updateProfileValidation, updateProfile);
router.delete('/account', deleteAccount);

// Routes administrateur
router.get('/all', requireRole('admin'), getAllUsers);
router.get('/stats', requireRole('admin'), getUserStats);

export default router;