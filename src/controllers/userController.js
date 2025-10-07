import { validationResult } from 'express-validator';
import { userDb } from '../utils/database.js';

export const getProfile = (req, res) => {
  try {
    const user = userDb.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    // Retourner les données utilisateur (sans le mot de passe)
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors de la récupération du profil'
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Données invalides',
        details: errors.array()
      });
    }

    const userId = req.user.id;
    const { firstName, lastName, email, avatar } = req.body;

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== req.user.email) {
      const existingUser = userDb.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          error: 'Email déjà utilisé',
          message: 'Cet email est déjà utilisé par un autre compte'
        });
      }
    }

    // Préparer les données à mettre à jour
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (email !== undefined) updates.email = email;
    if (avatar !== undefined) updates.avatar = avatar;

    // Mettre à jour l'utilisateur
    const updatedUser = await userDb.update(userId, updates);

    // Retourner les données utilisateur mises à jour (sans le mot de passe)
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      message: 'Profil mis à jour avec succès',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors de la mise à jour du profil'
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Supprimer l'utilisateur
    userDb.delete(userId);

    res.json({
      message: 'Compte supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors de la suppression du compte'
    });
  }
};

export const getAllUsers = (req, res) => {
  try {
    const users = userDb.getAllUsers();
    
    res.json({
      users,
      total: users.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors de la récupération des utilisateurs'
    });
  }
};

export const getUserStats = (req, res) => {
  try {
    const stats = userDb.getStats();
    
    res.json({
      stats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors de la récupération des statistiques'
    });
  }
};