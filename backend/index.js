// Importation de dotenv pour gérer les variables d’environnement
import dotenv from 'dotenv';
// Charger les variables d’environnement
dotenv.config();

// Importation des modules nécessaires
import { createServer } from 'http';
import app from './src/app.js';
import initDb from './src/config/database.js';


const PORT = process.env.PORT;
console.log(`Port défini sur : ${PORT}`);

// Initialiser la base de données puis démarrer le serveur
const startServer = async () => {
  try {
    // Initialise la connexion à SQLite
    const db = await initDb();
    
    // Attacher la base de données à l’application (optionnel mais utile)
    app.set('db', db);

    // Démarrer le serveur HTTP
    const server = createServer(app);
    server.listen(PORT, () => {
        console.log(`Base de données SQLite prête.`);
        console.log(`Backend démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur démarrage du serveur backend :', error.message);
    process.exit(1);
  }
};

startServer();