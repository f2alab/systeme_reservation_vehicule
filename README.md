# SRV: Système de Réservation de Véhicules

![Logo de l'application](./affiche.png)

## Contexte de l'Application

Application web full-stack de gestion des réservations de véhicules professionnels pour une organisation, afin de gérer efficacement les conflits de disponibilité des véhicules mis à disposition des employés.

_Développée par Ama-Edi Fabien Agouzou dans le cadre du processus de recrutement pour un stage en développement full-stack au Togo Data Lab._

## Choix Techniques Effectués

### Architecture Générale

- **Architecture Full-Stack** : Séparation claire entre le frontend (interface utilisateur) et le backend (API et logique métier).
- **Modèle Client-Serveur** : Communication via une API RESTful sécurisée.

### Backend

- **Langage** : JavaScript (Node.js) avec modules ES6.
- **Framework** : Express.js pour la création de l'API REST.
- **Base de Données** : SQLite, choisie pour sa simplicité de déploiement local, sa légèreté et son adéquation à un environnement de test. Utilisation de requêtes SQL paramétrées pour maintenir la sécurité et éviter les injections SQL.
- **Authentification** : JSON Web Tokens (JWT) avec expiration de 24 heures, combiné au hashage des mots de passe avec bcrypt.
- **Sécurité** : Middleware Helmet pour la protection des en-têtes HTTP, CORS pour la gestion des origines croisées.
- **Validation** : Validation manuelle des données d'entrée dans les contrôleurs.
- **Gestion des Erreurs** : Gestion centralisée des erreurs avec réponses HTTP appropriées.

### Frontend

- **Langage** : TypeScript pour une meilleure maintenabilité et sécurité des types.
- **Framework** : React 19 avec hooks personnalisés pour la gestion d'état.
- **Outil de Build** : Vite pour un développement rapide et une configuration moderne.
- **Styling** : Tailwind CSS pour un design responsive et cohérent.
- **Routing** : React Router DOM pour la navigation côté client.
- **Communication API** : Axios pour les requêtes HTTP avec gestion des erreurs.
- **Icônes** : Lucide React pour une interface utilisateur moderne.
- **Context API** : Gestion globale de l'état d'authentification et des notifications toast.

### Structure du Projet

- **Modularité** : Séparation des préoccupations avec des dossiers dédiés (controllers, models, routes, middleware).
- **Modèles** : Utilisation de fonctions pures pour les interactions avec la base de données.
- **Middleware** : Authentification et autorisation (rôles admin/user).
- **Composants Réutilisables** : Interface utilisateur modulaire avec des composants UI réutilisables.

## Principales Fonctionnalités Implémentées

### Authentification et Gestion des Utilisateurs

- **Inscription** : Création de comptes utilisateur avec validation des données.
- **Connexion** : Authentification sécurisée avec génération de token JWT.
- **Gestion des Rôles** : Différenciation entre utilisateurs standards et administrateur.
- **Gestion des Statuts** : Activation/désactivation des comptes utilisateur.
- **Modification du Mot de Passe** : Fonctionnalité sécurisée de changement de mot de passe.

### Gestion des Véhicules

- **Consultation** : Affichage de la liste des véhicules avec leurs caractéristiques (marque, modèle, plaque, couleur, nombre de sièges, type de carburant).
- **Ajout de Véhicules** : Interface d'administration pour ajouter de nouveaux véhicules.
- **Modification** : Mise à jour des informations et du statut des véhicules (opérationnel/en maintenance).
- **Suppression** : Possibilité de supprimer des véhicules (avec contraintes de clés étrangères).

### Gestion des Réservations

- **Création de Réservations** : Formulaire de réservation avec sélection de véhicule, dates de début/fin et motif.
- **Validation des Conflits** : Vérification automatique des chevauchements de dates pour éviter les réservations simultanées sur le même véhicule.
- **Contrôle d'Unicité Utilisateur** : Un utilisateur ne peut pas avoir plusieurs réservations actives sur des périodes chevauchantes.
- **Annulation** : Possibilité d'annuler ses propres réservations.
- **Approbation/Rejet** : Fonctionnalités administrateur pour valider ou rejeter les demandes de réservation.
- **Historique** : Consultation des réservations passées et futures pour chaque utilisateur.
- **Vue d'Ensemble** : Interface administrateur pour visualiser toutes les réservations avec détails.

### Interface Utilisateur

- **Design Responsive** : Adaptation aux différents formats d'écran (desktop, mobile).
- **Navigation Intuitive** : Menu de navigation et redirection basée sur les rôles.
- **Notifications** : Système de toasts pour informer l'utilisateur des actions réussies ou des erreurs.
- **Modales et Dialogues** : Interfaces interactives pour les actions sensibles (confirmation, édition).
- **Gestion d'État** : Utilisation de contextes React pour la gestion globale de l'authentification et des données.

### Sécurité et Intégrité des Données

- **Protection des Routes** : Middleware d'authentification pour sécuriser les endpoints sensibles.
- **Validation des Données** : Vérification côté serveur des entrées utilisateur.
- **Contraintes de Base de Données** : Utilisation des clés étrangères et des contraintes d'intégrité.
- **Hashage des Mots de Passe** : Stockage sécurisé des mots de passe utilisateur.
- **Expiration des Tokens** : Limitation de la durée de validité des sessions.

## Instructions de Lancement

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation et Lancement

1. **Cloner le dépôt Git** :

   ```
   git clone https://github.com/f2alab/systeme_reservation_vehicule.git

   cd systeme_reservation_vehicule
   ```

2. **Lancer le Backend** :

   ```
   cd backend
   npm install
   npm run dev
   ```

   Le serveur backend sera accessible sur `http://localhost:3001`.

3. **Lancer le Frontend** (dans un nouveau terminal) :

   ```
   cd frontend
   npm install
   npm run dev
   ```

   L'application frontend sera accessible sur `http://localhost:3000`.

4. **Accéder à l'Application** :
   Ouvrez votre navigateur et allez sur `http://localhost:3000`.

### Connexion Administrateur

- **Email** : <admin@admin.tg>

- **Mot de Passe** : superadmin

### Base de Données

La base de données SQLite est créée automatiquement au premier lancement dans `backend/data/database.sqlite`. Des données de test (utilisateur admin et véhicules par défaut) sont insérées automatiquement.
