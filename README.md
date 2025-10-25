# API Node.js - Vue Dashboard Authentication

API REST sécurisée pour l'authentification et la gestion des utilisateurs du dashboard Vue.

## 🚀 Fonctionnalités

### 🔐 Authentification
- **Connexion** avec email/mot de passe
- **Inscription** avec validation des données
- **JWT Token** pour l'authentification
- **Refresh Token** pour renouveler les sessions
- **Changement de mot de passe** sécurisé
- **Déconnexion** avec nettoyage des tokens

### 👤 Gestion des Utilisateurs
- **Profil utilisateur** - récupération et mise à jour
- **Suppression de compte**
- **Gestion des rôles** (admin/user)
- **Statistiques utilisateurs** (admin uniquement)

### 🛡️ Sécurité
- **Hachage des mots de passe** avec bcrypt
- **Validation des données** avec express-validator
- **Rate limiting** pour prévenir les attaques
- **CORS** configuré pour le frontend Vue
- **Helmet** pour les en-têtes de sécurité
- **Validation de la force des mots de passe**

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

## 🛠️ Installation

1. Naviguer vers le dossier de l'API :
   ```bash
   cd api-server
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Configurer les variables d'environnement :
   ```bash
   cp .env.example .env
   ```
   Puis modifier le fichier `.env` avec vos valeurs.

4. Démarrer le serveur :
   ```bash
   # Mode développement
   npm run dev
   
   # Mode production
   npm start
   ```

## 🌐 Endpoints API

### Authentification (`/api/auth`)

#### POST `/api/auth/login`
Connexion d'un utilisateur.

**Body :**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Réponse :**
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "lastLogin": "2023-12-01T10:30:00.000Z"
  }
}
```

#### POST `/api/auth/register`
Inscription d'un nouvel utilisateur.

**Body :**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePassword123!",
  "firstName": "Jane",
  "lastName": "Smith"
}
```

#### POST `/api/auth/change-password`
Changement de mot de passe (authentification requise).

**Headers :**
```
Authorization: Bearer <token>
```

**Body :**
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "NewSecurePassword123!"
}
```

#### POST `/api/auth/refresh`
Rafraîchissement du token (authentification requise).

#### POST `/api/auth/logout`
Déconnexion (authentification requise).

#### GET `/api/auth/me`
Test d'authentification.

### Utilisateurs (`/api/user`)

#### GET `/api/user/profile`
Récupération du profil utilisateur (authentification requise).

#### PUT `/api/user/profile`
Mise à jour du profil utilisateur (authentification requise).

**Body :**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### DELETE `/api/user/account`
Suppression du compte utilisateur (authentification requise).

#### GET `/api/user/all`
Liste de tous les utilisateurs (admin uniquement).

#### GET `/api/user/stats`
Statistiques des utilisateurs (admin uniquement).

## 🔑 Utilisateurs de Démonstration

L'API est livrée avec deux utilisateurs de test :

### Administrateur
- **Email :** `admin@example.com`
- **Mot de passe :** `password`
- **Rôle :** `admin`

### Utilisateur Standard
- **Email :** `user@example.com`
- **Mot de passe :** `password`
- **Rôle :** `user`

## 🏗️ Structure du Projet

```
api-server/
├── src/
│   ├── controllers/          # Logique métier
│   │   ├── authController.js
│   │   └── userController.js
│   ├── middleware/           # Middleware personnalisés
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── routes/              # Définition des routes
│   │   ├── auth.js
│   │   └── user.js
│   └── utils/               # Utilitaires
│       ├── database.js      # Base de données en mémoire
│       ├── jwt.js           # Gestion JWT
│       └── password.js      # Gestion des mots de passe
├── .env                     # Variables d'environnement
├── package.json             # Dépendances et scripts
└── server.js               # Point d'entrée principal
```

## 🔒 Validation des Mots de Passe

Les mots de passe doivent respecter les critères suivants :
- **Minimum 8 caractères**
- **Au moins une lettre majuscule**
- **Au moins une lettre minuscule**
- **Au moins un chiffre**
- **Au moins un caractère spécial** (!@#$%^&*(),.?":{}|<>)

## 🗄️ Base de Données

Cette version utilise une base de données en mémoire pour la simplicité de la démonstration. En production, vous devriez :

1. **Utiliser une vraie base de données** (PostgreSQL, MongoDB, MySQL, etc.)
2. **Implémenter des migrations** pour la structure des données
3. **Ajouter la persistance** des données
4. **Gérer les connexions** à la base de données

### Exemple d'intégration PostgreSQL

```javascript
import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
})
```

## 🚀 Déploiement

### Variables d'Environnement de Production

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=votre_secret_jwt_super_securise_512_bits
JWT_EXPIRES_IN=24h
DB_HOST=your-db-host
DB_PORT=5432
DB_NAME=vue_dashboard_prod
DB_USER=your-db-user
DB_PASSWORD=your-secure-db-password
```

### Sécurité en Production

1. **Changez le JWT_SECRET** - utilisez une clé aléatoire de 512 bits
2. **Utilisez HTTPS** - configurez SSL/TLS
3. **Limitez CORS** - spécifiez vos domaines exacts
4. **Monitoring** - ajoutez des logs et surveillance
5. **Rate Limiting** - ajustez les limites selon vos besoins

## 🧪 Tests

Vous pouvez tester l'API avec curl, Postman, ou tout autre client HTTP :

```bash
# Test de connexion
curl -X POST https://6c79d18c-api-server.lassus-xavier.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'

# Test du profil (avec token)
curl -X GET https://6c79d18c-api-server.lassus-xavier.workers.dev/api/auth/user/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Logs et Debugging

Le serveur affiche des logs détaillés en mode développement. Pour activer les logs en production, modifiez le niveau de log dans `server.js`.

## 🤝 Intégration avec Vue.js

L'API est déjà configurée pour fonctionner avec le frontend Vue.js Dashboard. Le service d'authentification Vue (`src/services/auth.ts`) est configuré pour utiliser cette API.

### Configuration CORS

L'API accepte les requêtes depuis :
- `http://localhost:3000` (développement Vue)
- `http://127.0.0.1:3000` (alternative locale)

Pour la production, modifiez la configuration CORS dans `server.js`.

## 📚 Technologies Utilisées

- **Express.js** - Framework web
- **JWT** - Authentification par tokens
- **bcryptjs** - Hachage des mots de passe
- **express-validator** - Validation des données
- **cors** - Gestion des requêtes cross-origin
- **helmet** - Sécurisation des en-têtes HTTP
- **express-rate-limit** - Limitation du taux de requêtes
- **dotenv** - Gestion des variables d'environnement

## 🐛 Dépannage

### Port déjà utilisé
Si le port 3001 est déjà utilisé, modifiez la variable `PORT` dans le fichier `.env`.

### Erreurs CORS
Vérifiez que l'URL du frontend Vue est bien dans la liste des origines autorisées.

### Problèmes de Token
Les tokens JWT expirent après 24h par défaut. Utilisez l'endpoint `/refresh` pour renouveler les tokens.

## 📄 Licence

MIT License