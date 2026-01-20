// Service pour la gestion des réservations
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { Reservation } from '../types/models';

export interface CreateReservationData {
  vehicle_id: number;
  start_date: string;
  end_date: string;
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

// Récupérer toutes les réservations avec détails (admin seulement)
export const getAllReservationsWithDetails = async (): Promise<ReservationWithDetails[]> => {
  const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.RESERVATIONS.GET_ALL}`);
  return response.data;
};
