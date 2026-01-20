// Importation des modules nécessaires
import { getAllVehicles, createVehicle, getVehicleById, updateVehicleStatus, updateVehicleInfo, deleteVehicle } from '../models/Vehicule.js';

export const getAll = async (req, res) => {
  try {
    const vehicles = await getAllVehicles(req.app.get('db'));
    res.json(vehicles);
  } catch (error) {
    console.error('Erreur récupération véhicules:', error);
    res.status(500).json({ error: 'Impossible de charger les véhicules.' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await getVehicleById(req.app.get('db'), id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Erreur récupération véhicule:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du véhicule.' });
  }
};

// Ajout de véhicule 
export const create = async (req, res) => {
  try {
    const { brand, model, plate_number, color, seats, fuel_type } = req.body;

    // Validation des données
    if (!brand || !model || !plate_number || !color || !seats || !fuel_type) {
      return res.status(400).json({ error: 'Marque, modèle, plaque, couleur, nombre de sièges et type de carburant sont requis.' });
    }

    // // Verifier si utilisateur connecté
    // if (!req.user) {
    //   return res.status(401).json({ error: 'Authentification requise.' });
    // }

    // // Verification des droits administrateur
    // if (!req.user.role || req.user.role !== 'admin') {
    //   return res.status(403).json({ error: `Vous n'êtes pas autorisé à ajouter un véhicule.` });
    // }

    // Verification de l'unicité de la plaque d'immatriculation
    const existingVehicle = await getVehicleById(req.app.get('db'), plate_number);
    if (existingVehicle) {
      return res.status(409).json({ error: 'Un véhicule avec cette plaque existe déjà.' });
    }

    const vehicle = await createVehicle(req.app.get('db'), { brand, model, plate_number, color, seats, fuel_type });
    res.status(201).json(vehicle);
  } catch (error) {
    // if (error.message?.includes('Erreur de contrainte de clé unique')) {
    //   return res.status(409).json({ error: 'Un véhicule avec cette plaque existe déjà.' });
    // }
    console.error('Erreur création véhicule:', error);
    res.status(500).json({ error: 'Impossible de créer le véhicule.' });
  }
};

// Mise à jour du statut du véhicule
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // // Verifier si utilisateur connecté
    // if (!req.user) {
    //   return res.status(401).json({ error: 'Authentification requise.' });
    // }

    // // Verification des droits administrateur
    // if (!req.user.role || req.user.role !== 'admin') {
    //   return res.status(403).json({ error: `Vous n'êtes pas autorisé à modifier le statut d'un véhicule.` });
    // }

    const vehicle = await updateVehicleStatus(req.app.get('db'), id, status);
    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Erreur mise à jour statut véhicule:', error);
    res.status(500).json({ error: 'Impossible de mettre à jour le statut du véhicule.' });
  }
};

// Update vehicule info
export const updateInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { brand, model, plate_number, color, seats, fuel_type, status } = req.body;

    // // Verifier si utilisateur connecté
    // if (!req.user) {
    //   return res.status(401).json({ error: 'Authentification requise.' });
    // }
    // // Verification des droits administrateur
    // if (!req.user.role || req.user.role !== 'admin') {
    //   return res.status(403).json({ error: `Vous n'êtes pas autorisé à modifier les informations d'un véhicule.` });
    // }
    const vehicle = await updateVehicleInfo(req.app.get('db'), id, { brand, model, plate_number, color, seats, fuel_type, status });
    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Erreur mise à jour info véhicule:', error);
    res.status(500).json({ error: 'Impossible de mettre à jour les informations du véhicule.' });
  }
};

// Supprimer un véhicule
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    // // Verifier si utilisateur connecté
    // if (!req.user) {
    //   return res.status(401).json({ error: 'Authentification requise.' });
    // }
    // // Verification des droits administrateur
    // if (!req.user.role || req.user.role !== 'admin') {
    //   return res.status(403).json({ error: `Vous n'êtes pas autorisé à supprimer un véhicule.` });
    // }
    const vehicle = await deleteVehicle(req.app.get('db'), id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Véhicule non trouvé.' });
    }
    res.json({ message: 'Véhicule supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur suppression véhicule:', error);
    res.status(500).json({ error: 'Impossible de supprimer le véhicule.' });
  }
};
