import { validationResult } from 'express-validator';
import { comparePassword, validatePasswordStrength } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { userDb } from '../utils/database.js';

export const login = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = userDb.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'Identifiants invalides',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return res.status(401).json({
        error: 'Compte désactivé',
        message: 'Votre compte a été désactivé. Contactez l\'administrateur.'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Identifiants invalides',
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Mettre à jour la dernière connexion
    userDb.updateLastLogin(user.id);

    // Générer le token JWT
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors de la connexion'
    });
  }
};

export const register = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { email, password, firstName, lastName } = req.body;

    // Valider la force du mot de passe
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Mot de passe faible',
        message: 'Le mot de passe ne respecte pas les critères de sécurité',
        details: passwordValidation.errors
      });
    }

    // Créer l'utilisateur
    const newUser = await userDb.create({
      email,
      password,
      firstName,
      lastName,
      role: 'user'
    });

    // Générer le token JWT
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    // Retourner les données utilisateur (sans le mot de passe)
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    
    if (error.message.includes('existe déjà')) {
      return res.status(409).json({
        error: 'Email déjà utilisé',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors de l\'inscription'
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // L'utilisateur est déjà authentifié grâce au middleware
    const user = userDb.findById(req.user.id);
    if (!user || !user.isActive) {
      return res.status(401).json({
        error: 'Utilisateur non trouvé ou désactivé'
      });
    }

    // Générer un nouveau token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    res.json({
      message: 'Token rafraîchi avec succès',
      token
    });

  } catch (error) {
    console.error('Erreur lors du rafraîchissement du token:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors du rafraîchissement du token'
    });
  }
};

export const logout = (req, res) => {
  // Dans une implémentation avec une liste noire de tokens, 
  // on ajouterait le token à la liste noire ici
  res.json({
    message: 'Déconnexion réussie'
  });
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Trouver l'utilisateur
    const user = userDb.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    // Vérifier l'ancien mot de passe
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        error: 'Mot de passe actuel incorrect'
      });
    }

    // Valider le nouveau mot de passe
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        error: 'Nouveau mot de passe faible',
        message: 'Le nouveau mot de passe ne respecte pas les critères de sécurité',
        details: passwordValidation.errors
      });
    }

    // Mettre à jour le mot de passe
    await userDb.update(userId, { password: newPassword });

    res.json({
      message: 'Mot de passe modifié avec succès'
    });

  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors du changement de mot de passe'
    });
  }
};