// Service pour la gestion des véhicules
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';
import type { Vehicule } from '../types/models';

export interface CreateVehicleData {
  brand: string;
  model: string;
  plate_number: string;
  color: string;
  seats: number;
  fuel_type: string;
}

export interface UpdateVehicleStatusData {
  status: 'operational' | 'maintenance';
}

export interface UpdateVehicleInfoData {
  brand: string;
  model: string;
  plate_number: string;
  color: string;
  seats: number;
  fuel_type: string;
  status: 'operational' | 'maintenance';
}

// Récupérer tous les véhicules
export const getAllVehicles = async (): Promise<Vehicule[]> => {
  const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES.GET_ALL}`);
  return response.data;
};

// Récupérer un véhicule par ID
export const getVehicleById = async (id: string): Promise<Vehicule> => {
  const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES.GET_BY_ID}${id}`);
  return response.data;
};

// Créer un nouveau véhicule (admin seulement)
export const createVehicle = async (vehicleData: CreateVehicleData): Promise<Vehicule> => {
  const response = await axios.post(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES.CREATE}`, vehicleData);
  return response.data;
};

// Mettre à jour le statut d'un véhicule (admin seulement)
export const updateVehicleStatus = async (id: string, statusData: UpdateVehicleStatusData): Promise<Vehicule> => {
  const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES.UPDATE_STATUS}${id}`, statusData);
  return response.data;
};

// Mettre à jour les informations d'un véhicule (admin seulement)
export const updateVehicleInfo = async (id: string, vehicleData: UpdateVehicleInfoData): Promise<Vehicule> => {
  const response = await axios.put(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES.UPDATE_INFO}${id}`, vehicleData);
  return response.data;
};

// Supprimer un véhicule (admin seulement)
export const deleteVehicle = async (id: string): Promise<{ message: string }> => {
  const response = await axios.delete(`${API_BASE_URL}${API_ENDPOINTS.VEHICLES.DELETE}${id}`);
  return response.data;
};
