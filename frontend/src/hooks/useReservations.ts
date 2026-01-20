// Hook personnalisé pour la gestion des réservations
import { useState, useCallback } from 'react';
import {
  createReservation,
  getUserReservations,
  cancelReservation,
  approveReservation,
  disapproveReservation,
  getAllReservationsWithDetails,
  type CreateReservationData
} from '../services/reservation.service';
import type { Reservation, ReservationWithDetails } from '../types/models';

export const useReservations = () => {
  const [reservations, setReservations] = useState<ReservationWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les réservations de l'utilisateur connecté
  const loadUserReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserReservations();
      setReservations(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger toutes les réservations avec détails (admin)
  const loadAllReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllReservationsWithDetails();
      setReservations(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  }, []);

  // Annuler une réservation
  const cancelUserReservation = useCallback(async (reservationId: string): Promise<boolean> => {
    try {
      await cancelReservation(reservationId);
      // Recharger les réservations après annulation
      await loadUserReservations();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'annulation de la réservation');
      return false;
    }
  }, [loadUserReservations]);

  // Approuver une réservation (admin)
  const approveUserReservation = useCallback(async (reservationId: string): Promise<boolean> => {
    try {
      await approveReservation(reservationId);
      // Recharger les réservations après approbation
      await loadAllReservations();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'approbation de la réservation');
      return false;
    }
  }, [loadAllReservations]);

  // Désapprouver une réservation (admin)
  const disapproveUserReservation = useCallback(async (reservationId: string): Promise<boolean> => {
    try {
      await disapproveReservation(reservationId);
      // Recharger les réservations après désapprobation
      await loadAllReservations();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la désapprobation de la réservation');
      return false;
    }
  }, [loadAllReservations]);

  // Créer une nouvelle réservation
  const createNewReservation = useCallback(async (reservationData: CreateReservationData): Promise<{ reservation: Reservation | null; error: string | null }> => {
    try {
      const newReservation = await createReservation(reservationData);
      // Recharger les réservations après création
      await loadUserReservations();
      return { reservation: newReservation, error: null };
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erreur lors de la création de la réservation';
      setError(errorMessage);
      return { reservation: null, error: errorMessage };
    }
  }, [loadUserReservations]);

  // Pas de chargement automatique au montage - laissé à la discrétion du composant

  return {
    reservations,
    loading,
    error,
    loadUserReservations,
    loadAllReservations,
    createNewReservation,
    cancelUserReservation,
    approveUserReservation,
    disapproveUserReservation,
    clearError: () => setError(null)
  };
};
