# Gestion des Réservations de Véhicules

## Contexte
Application permettant aux employés d’une organisation de réserver des véhicules professionnels, en évitant les conflits de disponibilité.

## Choix techniques
- **Frontend** : React + Tailwind CSS
- **Backend** : Node.js + Express
- **Base de données** : SQLite, choisie pour sa simplicité de déploiement local, sa légèreté et son adéquation avec un test pratique. J’ai choisi d’utiliser SQLite avec des requêtes SQL paramétrées pour garder l’architecture légère, éviter la surcharge d’un ORM, et me concentrer sur la logique métier (gestion des conflits de réservation)
- **Authentification** : JWT avec hashage bcrypt
- **Validation** : express-validator
- **Déploiement local** : npm scripts

## Fonctionnalités
- Inscription et connexion sécurisées
- Consultation des véhicules
- Création de réservation avec vérification de disponibilité
- Affichage des réservations passées et futures

## Installation & Lancement
1. Cloner le dépôt
2. `cd backend && npm install && npm start`
3. `cd frontend && npm install && npm start`
4. Accéder à `http://localhost:3000`