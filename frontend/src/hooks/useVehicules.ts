// Hook personnalisé pour la gestion des véhicules
import { useState, useEffect, useCallback } from 'react';
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicleStatus,
  updateVehicleInfo,
  deleteVehicle,
  type CreateVehicleData,
  type UpdateVehicleStatusData,
  type UpdateVehicleInfoData
} from '../services/vehicule.service';
import type { Vehicule } from '../types/models';

export const useVehicules = () => {
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les véhicules
  const loadVehicules = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllVehicles();
      setVehicules(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des véhicules');
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger un véhicule par ID
  const loadVehiculeById = useCallback(async (id: string): Promise<Vehicule | null> => {
    try {
      const data = await getVehicleById(id);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement du véhicule');
      return null;
    }
  }, []);

  // Créer un véhicule
  const createNewVehicule = useCallback(async (vehicleData: CreateVehicleData): Promise<Vehicule | null> => {
    try {
      const newVehicule = await createVehicle(vehicleData);
      setVehicules(prev => [...prev, newVehicule]);
      return newVehicule;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la création du véhicule');
      return null;
    }
  }, []);

  // Mettre à jour le statut d'un véhicule
  const updateVehiculeStatus = useCallback(async (id: string, statusData: UpdateVehicleStatusData): Promise<Vehicule | null> => {
    try {
      const updatedVehicule = await updateVehicleStatus(id, statusData);
      setVehicules(prev =>
        prev.map(vehicule =>
          vehicule.id === parseInt(id) ? updatedVehicule : vehicule
        )
      );
      return updatedVehicule;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour du statut');
      return null;
    }
  }, []);

  // Mettre à jour les informations d'un véhicule
  const updateVehiculeInfo = useCallback(async (id: string, vehicleData: UpdateVehicleInfoData): Promise<Vehicule | null> => {
    try {
      const updatedVehicule = await updateVehicleInfo(id, vehicleData);
      setVehicules(prev =>
        prev.map(vehicule =>
          vehicule.id === parseInt(id) ? updatedVehicule : vehicule
        )
      );
      return updatedVehicule;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour des informations');
      return null;
    }
  }, []);

  // Supprimer un véhicule
  const removeVehicule = useCallback(async (id: string): Promise<boolean> => {
    try {
      await deleteVehicle(id);
      setVehicules(prev => prev.filter(vehicule => vehicule.id !== parseInt(id)));
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la suppression du véhicule');
      return false;
    }
  }, []);

  // Charger les véhicules au montage du composant
  useEffect(() => {
    loadVehicules();
  }, [loadVehicules]);

  return {
    vehicules,
    loading,
    error,
    loadVehicules,
    loadVehiculeById,
    createNewVehicule,
    updateVehiculeStatus,
    updateVehiculeInfo,
    removeVehicule,
    clearError: () => setError(null)
  };
};
