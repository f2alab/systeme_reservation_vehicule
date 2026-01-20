// Hook personnalisé pour la gestion des utilisateurs
import { useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import type { User } from '../types/models';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les utilisateurs
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour le statut d'un utilisateur
  const updateUserStatusAction = useCallback(async (id: string, status: string): Promise<User | null> => {
    try {
      const updatedUser = await authService.updateUserStatus(parseInt(id), status);
      setUsers(prev =>
        prev.map(user =>
          user.id === parseInt(id) ? { ...user, status } : user
        )
      );
      return updatedUser;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la mise à jour du statut');
      return null;
    }
  }, []);

  // Charger les utilisateurs au montage du composant
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    loadUsers,
    updateUserStatus: updateUserStatusAction,
    clearError: () => setError(null)
  };
};
