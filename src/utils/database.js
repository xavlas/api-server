import { v4 as uuidv4 } from 'uuid';
import { hashPassword } from '../utils/password.js';

// Base de données en mémoire (pour la démo)
// En production, utilisez une vraie base de données comme PostgreSQL, MongoDB, etc.
class UserDatabase {
  constructor() {
    this.users = new Map();
    this.initializeDefaultUsers();
  }

  async initializeDefaultUsers() {
    // Créer des utilisateurs par défaut
    const defaultUsers = [
      {
        id: uuidv4(),
        email: 'admin@example.com',
        password: await hashPassword('password'),
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        avatar: null,
        createdAt: new Date(),
        lastLogin: null,
        isActive: true
      },
      {
        id: uuidv4(),
        email: 'user@example.com',
        password: await hashPassword('password'),
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        avatar: null,
        createdAt: new Date(),
        lastLogin: null,
        isActive: true
      }
    ];

    for (const user of defaultUsers) {
      this.users.set(user.email, user);
    }
  }

  // Trouver un utilisateur par email
  findByEmail(email) {
    return this.users.get(email.toLowerCase());
  }

  // Trouver un utilisateur par ID
  findById(id) {
    for (const user of this.users.values()) {
      if (user.id === id) {
        return user;
      }
    }
    return null;
  }

  // Créer un nouvel utilisateur
  async create(userData) {
    const existingUser = this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Un utilisateur avec cet email existe déjà');
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = {
      id: uuidv4(),
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || 'user',
      avatar: userData.avatar || null,
      createdAt: new Date(),
      lastLogin: null,
      isActive: true
    };

    this.users.set(newUser.email, newUser);
    return newUser;
  }

  // Mettre à jour un utilisateur
  async update(id, updates) {
    const user = this.findById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Si le mot de passe est mis à jour, le hasher
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Mettre à jour les champs
    Object.assign(user, updates);
    
    // Mettre à jour dans la Map si l'email a changé
    if (updates.email && updates.email !== user.email) {
      this.users.delete(user.email);
      user.email = updates.email.toLowerCase();
      this.users.set(user.email, user);
    }

    return user;
  }

  // Supprimer un utilisateur
  delete(id) {
    const user = this.findById(id);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    this.users.delete(user.email);
    return true;
  }

  // Mettre à jour la dernière connexion
  updateLastLogin(id) {
    const user = this.findById(id);
    if (user) {
      user.lastLogin = new Date();
    }
    return user;
  }

  // Lister tous les utilisateurs (pour administration)
  getAllUsers() {
    return Array.from(this.users.values()).map(user => {
      // Ne pas retourner les mots de passe
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  // Obtenir les statistiques
  getStats() {
    const users = Array.from(this.users.values());
    return {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.isActive).length,
      adminUsers: users.filter(u => u.role === 'admin').length,
      recentRegistrations: users.filter(u => {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return u.createdAt > oneWeekAgo;
      }).length
    };
  }
}

// Exporter une instance singleton
export const userDb = new UserDatabase();