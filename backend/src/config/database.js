// Importation des modules nécessaires
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createDefaultUser } from '../models/User.js';
import { createDefaultVehicles } from '../models/Vehicule.js';


const DB_FILE_PATH = process.env.DB_FILE_PATH || './data/database.sqlite';

// Chemin vers la base de données
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = dirname(dirname(__dirname)); 
const dbPath = join(projectRoot, DB_FILE_PATH);

// Fonction pour créer les tables nécessaires
const createTables = async (db) => {
  await db.exec(`
    -- Table utilisateurs
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL CHECK (email LIKE '%@%'),
      password TEXT NOT NULL,
      role TEXT CHECK (role IN ('admin', 'user')) NOT NULL,
      status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table vehicules
    CREATE TABLE IF NOT EXISTS vehicules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      plate_number TEXT UNIQUE NOT NULL,
      color TEXT NOT NULL,
      seats INTEGER DEFAULT 5,
      fuel_type TEXT CHECK(fuel_type IN ('gasoline', 'diesel', 'electric', 'hybrid')) DEFAULT 'gasoline',
      status TEXT CHECK(status IN ('operational', 'maintenance')) DEFAULT 'operational',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Table reservations
    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      vehicule_id INTEGER NOT NULL,
      start_date DATETIME NOT NULL,
      end_date DATETIME NOT NULL,
      status TEXT CHECK(status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
      motif TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (vehicule_id) REFERENCES vehicules(id) ON DELETE CASCADE,
      CHECK (end_date > start_date)
    );
  `);
}

// Ouvrir la base en mode promesse
const initDb = async () => {

  // Ouvrir la connexion à la base de données SQLite
  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Activer les clés étrangères
  await db.exec('PRAGMA foreign_keys = ON');

  // Créer les tables si elles n'existent pas déjà
  await createTables(db);

  // Ajouter un utilisateur admin par défaut s'il n'existe pas
  await createDefaultUser(db);

  // Ajout de vehicules par defaut
  await createDefaultVehicles(db);

  // Retourner l'instance de la base de données
  return db;
};

export default initDb;
