// Service pour la gestion des réservations
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { Reservation } from '../types/models';

export interface CreateReservationData {
  vehicle_id: number;
  start_date: string;
  end_date: string;
  motif: string;
}

export interface ReservationWithDetails extends Reservation {
  user?: {
    id: number;
    name: string;
    email: string;
  };
  vehicule?: {
    id: number;
    brand: string;
    model: string;
    plate_number: string;
    color: string;
    seats: number;
    fuel_type: string;
    status: string;
  };
}

// Créer une nouvelle réservation
export const createReservation = async (reservationData: CreateReservationData): Promise<Reservation> => {
  const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.CREATE}`, reservationData);
  return response.data;
};

// Récupérer les réservations de l'utilisateur connecté
export const getUserReservations = async (): Promise<ReservationWithDetails[]> => {
  const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.GET_USER}`);
  return response.data;
};

// Annuler une réservation
export const cancelReservation = async (reservationId: string): Promise<{ message: string }> => {
  const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.CANCEL}${reservationId}`);
  return response.data;
};

// Approuver une réservation (admin)
export const approveReservation = async (reservationId: string): Promise<{ message: string }> => {
  const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.APPROVE}${reservationId}`);
  return response.data;
};

// Désapprouver une réservation (admin)
export const disapproveReservation = async (reservationId: string): Promise<{ message: string }> => {
  const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.DISAPPROVE}${reservationId}`);
  return response.data;
};

// Récupérer toutes les réservations avec détails (admin seulement)
export const getAllReservationsWithDetails = async (): Promise<ReservationWithDetails[]> => {
  const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.GET_ALL}`);

  // Transformer les données pour correspondre à la structure attendue
  return response.data.map((reservation: any) => ({
    id: reservation.id,
    user_id: reservation.user_id,
    vehicule_id: reservation.vehicule_id,
    start_date: reservation.start_date,
    end_date: reservation.end_date,
    status: reservation.status,
    motif: reservation.motif,
    createdAt: reservation.created_at,
    user: {
      id: reservation.user_id,
      name: reservation.user_name,
      email: reservation.email
    },
    vehicule: {
      id: reservation.vehicule_id,
      brand: reservation.brand,
      model: reservation.model,
      plate_number: reservation.plate_number,
      color: reservation.color,
      seats: reservation.seats,
      fuel_type: reservation.fuel_type,
      status: reservation.vehicle_status
    }
  }));
};
