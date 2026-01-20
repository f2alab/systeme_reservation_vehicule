// Impotation des modules nécessaires
import {
  createReservation,
  findOverlappingReservations,
  findUserOverlappingReservations,
  getReservationsWithUserId,
  cancelReservation,
  getReservationsWithDetails
} from '../models/Reservation.js';
import { findUserById } from '../models/User.js';

// Fonction utilitaire pour valider les dates
const isValidDate = (dateStr) => !isNaN(Date.parse(dateStr));


export const create = async (req, res) => {
  try {
    const { vehicle_id, start_date, end_date } = req.body;
    const user_id = req.user?.id; // sera défini par le middleware d'auth

    if (!user_id) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    // Vérifier le statut de l'utilisateur
    const user = await findUserById(req.app.get('db'), user_id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ error: 'Votre compte est inactif. Vous ne pouvez pas effectuer de réservations.' });
    }

    // Vérifier si l'utilisateur a déjà une réservation qui chevauche ces dates
    const userConflict = await findUserOverlappingReservations(
      req.app.get('db'),
      user_id,
      start_date,
      end_date
    );

    if (userConflict) {
      return res.status(409).json({ error: 'Vous avez déjà une réservation en cours qui chevauche ces dates.' });
    }

    if (!vehicle_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Véhicule, date de début et date de fin requis.' });
    }

    if (!isValidDate(start_date) || !isValidDate(end_date)) {
      return res.status(400).json({ error: 'Dates invalides. Utilisez le format ISO (ex: 2026-01-20T10:00:00).' });
    }

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({ error: 'La date de fin doit être après la date de début.' });
    }

    // Vérifier les conflits
    const conflict = await findOverlappingReservations(
      req.app.get('db'),
      vehicle_id,
      start_date,
      end_date
    );

    if (conflict) {
      return res.status(409).json({ error: 'Ce véhicule est déjà réservé sur cette période.' });
    }

    const reservation = await createReservation(req.app.get('db'), {
      user_id,
      vehicle_id,
      start_date,
      end_date
    });

    res.status(201).json(reservation);
  } catch (error) {
    console.error('Erreur création réservation:', error);
    res.status(500).json({ error: 'Impossible de créer la réservation.' });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const reservations = await getReservationsWithUserId(req.app.get('db'), user_id);
    res.json(reservations);
  } catch (error) {
    console.error('Erreur historique réservations:', error);
    res.status(500).json({ error: 'Impossible de charger vos réservations.' });
  }
};

export const cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;

    if (!user_id) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const success = await cancelReservation(req.app.get('db'), id, user_id);

    if (!success) {
      return res.status(404).json({ error: 'Réservation non trouvée ou déjà annulée.' });
    }

    res.json({ message: 'Réservation annulée avec succès.' });
  } catch (error) {
    console.error('Erreur annulation réservation:', error);
    res.status(500).json({ error: 'Impossible d\'annuler la réservation.' });
  }
};

export const getAllReservationsWithDetails = async (req, res) => {
  try {
    const reservations = await getReservationsWithDetails(req.app.get('db'));
    res.json(reservations);
  } catch (error) {
    console.error('Erreur historique réservations:', error);
    res.status(500).json({ error: 'Impossible de charger vos réservations.' });
  }
};
