
import { useState, useEffect } from 'react';
import type { User, Vehicule } from '../types/models';
import { useToast } from '../contexts/ToastContext';
import { useVehicules } from '../hooks/useVehicules';
import { useReservations } from '../hooks/useReservations';
import { useUsers } from '../hooks/useUsers';
import ReservationModal from '../components/ui/ReservationModal';
import VehicleModal from '../components/ui/VehicleModal';
import PasswordModal from '../components/ui/PasswordModal';
import VehicleCard from '../components/ui/VehiculeCard';
import ReservationCard from '../components/ui/ReservationCard';
import UserCard from '../components/ui/UserCard';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { Car, ChevronDown, ChevronUp, Calendar, Users, User as UserIcon, Plus, LogOut } from 'lucide-react';



interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const {
    vehicules: vehicles,
    loading: vehiclesLoading,
    createNewVehicule,
    updateVehiculeInfo,
    removeVehicule  } = useVehicules();

  const {
    reservations,
    loading: reservationsLoading,
    error: reservationsError,
    loadUserReservations,
    loadAllReservations,
    createNewReservation,
    cancelUserReservation,
    approveUserReservation,
    disapproveUserReservation,
    clearError: clearReservationsError
  } = useReservations();

  const {
    users,
    loading: usersLoading,
    updateUserStatus  } = useUsers();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicule | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicule | null>(null);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'reservations' | 'users' | 'profile'>('vehicles');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleFuelFilter, setVehicleFuelFilter] = useState<string>('all');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<string>('all');
  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string>('all');
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [cancelReservationId, setCancelReservationId] = useState<number | null>(null);
  const [showApproveConfirmDialog, setShowApproveConfirmDialog] = useState(false);
  const [approveReservationId, setApproveReservationId] = useState<number | null>(null);
  const [showDisapproveConfirmDialog, setShowDisapproveConfirmDialog] = useState(false);
  const [disapproveReservationId, setDisapproveReservationId] = useState<number | null>(null);
  const [showLogoutConfirmDialog, setShowLogoutConfirmDialog] = useState(false);
  const [showDeleteVehicleConfirmDialog, setShowDeleteVehicleConfirmDialog] = useState(false);
  const [deleteVehicleData, setDeleteVehicleData] = useState<Vehicule | null>(null);
  const [showPasswordConfirmDialog, setShowPasswordConfirmDialog] = useState(false);
  const [isVehicleSearchExpanded, setIsVehicleSearchExpanded] = useState(false);
  const [isVehicleStatsExpanded, setIsVehicleStatsExpanded] = useState(false);
  const [isReservationSearchExpanded, setIsReservationSearchExpanded] = useState(false);
  const [isReservationStatsExpanded, setIsReservationStatsExpanded] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { showToast } = useToast();

  const handleReserve = (vehicle: Vehicule) => {
    setSelectedVehicle(vehicle);
    setShowReservationModal(true);
  };

  const handleReservationSubmit = async (startDate: string, endDate: string, motif: string) => {
    if (!selectedVehicle) return;

    const result = await createNewReservation({
      vehicle_id: selectedVehicle.id,
      start_date: startDate,
      end_date: endDate,
      motif
    });

    if (result.reservation) {
      showToast('Réservation créée avec succès !', 'success');
      setShowReservationModal(false);
      setSelectedVehicle(null);
    } else {
      // Afficher le message d'erreur réel du résultat
      showToast(result.error || 'Erreur lors de la création de la réservation', 'error');
    }
  };

  const handleCancelReservation = (reservationId: number) => {
    setCancelReservationId(reservationId);
    setShowCancelConfirmDialog(true);
  };

  const confirmCancelReservation = async () => {
    if (!cancelReservationId) return;

    const success = await cancelUserReservation(cancelReservationId.toString());
    setShowCancelConfirmDialog(false);

    if (success) {
      showToast('Réservation annulée avec succès !', 'success');
    } else {
      showToast(reservationsError || 'Erreur lors de l\'annulation de la réservation', 'error');
      clearReservationsError(); // Effacer l'erreur après l'avoir affichée
    }

    setCancelReservationId(null);
  };

  const handleApproveReservation = (reservationId: number) => {
    setApproveReservationId(reservationId);
    setShowApproveConfirmDialog(true);
  };

  const handleDisapproveReservation = (reservationId: number) => {
    setDisapproveReservationId(reservationId);
    setShowDisapproveConfirmDialog(true);
  };

  const confirmApproveReservation = async () => {
    if (!approveReservationId) return;

    const success = await approveUserReservation(approveReservationId.toString());
    setShowApproveConfirmDialog(false);

    if (success) {
      showToast('Réservation approuvée avec succès !', 'success');
    } else {
      showToast(reservationsError || 'Erreur lors de l\'approbation de la réservation', 'error');
      clearReservationsError();
    }

    setApproveReservationId(null);
  };

  const confirmDisapproveReservation = async () => {
    if (!disapproveReservationId) return;

    const success = await disapproveUserReservation(disapproveReservationId.toString());
    setShowDisapproveConfirmDialog(false);

    if (success) {
      showToast('Réservation désapprouvée avec succès !', 'success');
    } else {
      showToast(reservationsError || 'Erreur lors de la désapprobation de la réservation', 'error');
      clearReservationsError();
    }

    setDisapproveReservationId(null);
  };

  const handleEditVehicle = (vehicle: Vehicule) => {
    setEditingVehicle(vehicle);
    setShowVehicleModal(true);
  };

  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setShowVehicleModal(true);
  };

  const handleVehicleSubmit = async (vehicleData: Omit<Vehicule, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingVehicle) {
      // Mode édition
      const success = await updateVehiculeInfo(editingVehicle.id.toString(), vehicleData);
      if (success) {
        showToast('Véhicule modifié avec succès !', 'success');
      } else {
        showToast('Erreur lors de la modification du véhicule', 'error');
      }
    } else {
      // Mode ajout
      const newVehicle = await createNewVehicule(vehicleData);
      if (newVehicle) {
        showToast('Véhicule ajouté avec succès !', 'success');
      } else {
        showToast('Erreur lors de l\'ajout du véhicule', 'error');
      }
    }

    setShowVehicleModal(false);
    setEditingVehicle(null);
  };

  const handleDeleteVehicle = (vehicle: Vehicule) => {
    setDeleteVehicleData(vehicle);
    setShowDeleteVehicleConfirmDialog(true);
  };

  const confirmDeleteVehicle = async () => {
    if (!deleteVehicleData) return;

    const success = await removeVehicule(deleteVehicleData.id.toString());
    setShowDeleteVehicleConfirmDialog(false);

    if (success) {
      showToast('Véhicule supprimé avec succès !', 'success');
    } else {
      showToast('Erreur lors de la suppression du véhicule', 'error');
    }

    setDeleteVehicleData(null);
  };

  const confirmPasswordChange = () => {
    setShowPasswordConfirmDialog(false);
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = async (newPassword: string) => {
    try {
      // Importer authService ici pour éviter les importations circulaires
      const { authService } = await import('../services/auth.service');

      await authService.updatePassword(newPassword);
      showToast('Mot de passe modifié avec succès ! Vous allez être déconnecté.', 'success');
      setShowPasswordModal(false);

      // Se déconnecter automatiquement après un changement de mot de passe réussi
      setTimeout(() => {
        onLogout();
      }, 2000); // Donner du temps à l'utilisateur pour voir le message de succès
    } catch (error: any) {
      console.error('Password update error:', error);
      showToast(error.response?.data?.error || 'Erreur lors de la modification du mot de passe', 'error');
    }
  };

  // Fonctions de filtrage
  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicleSearch === '' ||
      vehicle.brand.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      vehicle.plate_number.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      vehicle.color.toLowerCase().includes(vehicleSearch.toLowerCase());

    const matchesFuel = vehicleFuelFilter === 'all' || vehicle.fuel_type === vehicleFuelFilter;
    const matchesStatus = vehicleStatusFilter === 'all' || vehicle.status === vehicleStatusFilter;

    return matchesSearch && matchesFuel && matchesStatus;
  });

  const filteredReservations = reservations.filter((reservation) => {
    const vehicle = vehicles.find(v => v.id === reservation.vehicule_id);
    if (!vehicle) return false;

    const matchesSearch = reservationSearch === '' ||
      vehicle.brand.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(reservationSearch.toLowerCase()) ||
      vehicle.plate_number.toLowerCase().includes(reservationSearch.toLowerCase());

    const matchesStatus = reservationStatusFilter === 'all' || reservation.status === reservationStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const clearVehicleFilters = () => {
    setVehicleSearch('');
    setVehicleFuelFilter('all');
    setVehicleStatusFilter('all');
  };

  const clearReservationFilters = () => {
    setReservationSearch('');
    setReservationStatusFilter('all');
  };

  const isAdmin = user.role === 'admin';

  // Charger les réservations selon le rôle utilisateur et l'onglet actif
  useEffect(() => {
    if (activeTab === 'reservations') {
      if (isAdmin) {
        loadAllReservations();
      } else {
        loadUserReservations();
      }
    }
  }, [activeTab, isAdmin, loadAllReservations, loadUserReservations]);

  // Charger les informations de l'utilisateur actuel quand on accède à l'onglet Profil
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (activeTab === 'profile') {
        try {
          const { authService } = await import('../services/auth.service');
          const token = localStorage.getItem('authToken');
          if (token) {
            const userData = await authService.getCurrentUser(token);
            console.log('Current user data:', userData);
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error('Erreur lors du chargement des informations utilisateur:', error);
        }
      }
    };

    loadCurrentUser();
  }, [activeTab]);

  // Chargement initial - attendre que les données soient chargées
  if (vehiclesLoading || reservationsLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-500">Chargement des données...</p>
        </div>
      </div>
    );
  }

  // Contenu
  return (
    <div className="h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg">
              <Car className='h-6 w-6 text-white' />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SRV</h1>
              <p className="text-xs text-gray-500">Système de Reservation de Voitures</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutConfirmDialog(true)}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-400 transition flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Boutons de Navigation - Fixed */}
      <div className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('vehicles')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'vehicles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Car className="inline-block w-5 h-5 mr-2" />
              Voitures
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'reservations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="inline-block w-5 h-5 mr-2" />
              Réservations
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('users')}
                className={`px-4 py-3 font-medium border-b-2 transition ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="inline-block w-5 h-5 mr-2" />
                Utilisateurs
              </button>
            )}
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <UserIcon className="inline-block w-5 h-5 mr-2" />
              Profil
            </button>
          </div>
        </div>
      </div>

      {/* Contenu Principal - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Vehicules Tab */}
        {activeTab === 'vehicles' && (
          <>
            {/* Bouton Ajouter véhicule - visible seulement pour les admins */}
            {isAdmin && (
              <div className="mb-6 flex justify-end">
                <button
                  onClick={handleAddVehicle}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Ajouter un véhicule
                </button>
              </div>
            )}

            {/* Recherche et filtrage */}
            <div className="bg-white border border-gray-300 rounded-lg mb-6">
              <button
                onClick={() => setIsVehicleSearchExpanded(!isVehicleSearchExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">Recherche et Filtrage</h3>
                {isVehicleSearchExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                isVehicleSearchExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rechercher
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Marque, modèle, plaque, couleur..."
                          value={vehicleSearch}
                          onChange={(e) => setVehicleSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type de Carburant
                      </label>
                      <select
                        value={vehicleFuelFilter}
                        onChange={(e) => setVehicleFuelFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="all">Tous</option>
                        <option value="gasoline">Essence</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Électrique</option>
                        <option value="hybrid">Hybride</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={vehicleStatusFilter}
                        onChange={(e) => setVehicleStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="all">Tous</option>
                        <option value="operational">Opérationnel</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    <button
                      onClick={clearVehicleFilters}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredVehicles.length} véhicule(s) trouvé(s)
              </p>
            </div>

            {isAdmin && (
              <div className="bg-white border border-gray-300 rounded-lg mb-6">
                <button
                  onClick={() => setIsVehicleStatsExpanded(!isVehicleStatsExpanded)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <h3 className="text-lg font-semibold text-gray-900">Statistiques des Véhicules</h3>
                  {isVehicleStatsExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${
                  isVehicleStatsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{vehicles.length}</div>
                        <div className="text-sm text-gray-600">Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {vehicles.filter(v => v.status === 'operational').length}
                        </div>
                        <div className="text-sm text-gray-600">Opérationnels</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">
                          {vehicles.filter(v => v.status === 'maintenance').length}
                        </div>
                        <div className="text-sm text-gray-600">Maintenance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onReserve={handleReserve}
                  isAdmin={isAdmin}
                  userStatus={user.status}
                  onEdit={handleEditVehicle}
                  onDelete={handleDeleteVehicle}
                />
              ))}
            </div>
          </>
        )}

        {/* Reservations Tab */}
        {activeTab === 'reservations' && (
          <>
            {/* Recherche et filtres */}
            <div className="bg-white border border-gray-300 rounded-lg mb-6">
              <button
                onClick={() => setIsReservationSearchExpanded(!isReservationSearchExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">Recherche et Filtrage</h3>
                {isReservationSearchExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                isReservationSearchExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rechercher
                      </label>
                      <div className="relative">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Marque, modèle, plaque..."
                          value={reservationSearch}
                          onChange={(e) => setReservationSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut
                      </label>
                      <select
                        value={reservationStatusFilter}
                        onChange={(e) => setReservationStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      >
                        <option value="all">Tous</option>
                        <option value="pending">En attente</option>
                        <option value="confirmed">Confirmée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </div>
                    <button
                      onClick={clearReservationFilters}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
                    >
                      Réinitialiser
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {filteredReservations.length} réservation(s) trouvée(s)
              </p>
            </div>

            <div className="bg-white border border-gray-300 rounded-lg mb-6">
              <button
                onClick={() => setIsReservationStatsExpanded(!isReservationStatsExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <h3 className="text-lg font-semibold text-gray-900">Statistiques des Réservations</h3>
                {isReservationStatsExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                isReservationStatsExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{reservations.length}</div>
                      <div className="text-sm text-gray-600">Total Réservations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {reservations.filter(r => r.status === 'pending').length}
                      </div>
                      <div className="text-sm text-gray-600">En attente</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {reservations.filter(r => r.status === 'confirmed').length}
                      </div>
                      <div className="text-sm text-gray-600">Confirmées</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {reservations.filter(r => r.status === 'cancelled').length}
                      </div>
                      <div className="text-sm text-gray-600">Annulées</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredReservations.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg">Aucune réservation trouvée</p>
                  <p className="text-gray-400 text-sm">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              ) : (
                filteredReservations.map((reservation) => {
                  const vehicle = vehicles.find(v => v.id === reservation.vehicule_id);
                  return vehicle ? (
                    <ReservationCard
                      key={reservation.id}
                      reservation={reservation}
                      vehicle={vehicle}
                      onCancel={handleCancelReservation}
                      onApprove={handleApproveReservation}
                      onDisapprove={handleDisapproveReservation}
                      isAdmin={isAdmin}
                      user={reservation.user}
                      currentUserId={user.id}
                    />
                  ) : null;
                })
              )}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && isAdmin && (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {users.length} utilisateur(s) trouvé(s)
              </p>
            </div>

            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
                </div>
              ) : (
                users.map((userItem) => (
                  <UserCard
                    key={userItem.id}
                    user={userItem}
                    onStatusChange={(userId, newStatus) => {
                      updateUserStatus(userId, newStatus);
                      showToast(
                        `Utilisateur ${newStatus === 'active' ? 'activé' : 'désactivé'} avec succès !`,
                        'success'
                      );
                    }}
                  />
                ))
              )}
            </div>
          </>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-300 rounded-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Mon Profil</h2>
                <p className="text-gray-600">Informations de votre compte</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet
                    </label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse Email
                    </label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rôle
                    </label>
                    <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 capitalize">
                      {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Statut du compte
                    </label>
                    <div className={`px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-medium ${
                      currentUser?.status === 'active'
                        ? 'text-green-700 border-green-300'
                        : 'text-red-700 border-red-300'
                    }`}>
                      {currentUser?.status === 'active' ? 'Actif' : 'Inactif'}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'inscription
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dernière mise à jour
                  </label>
                  <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                    {new Date(user.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Modifier le mot de passe
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Reservation Modal */}
      {showReservationModal && selectedVehicle && (
        <ReservationModal
          vehicule={selectedVehicle}
          onClose={() => {
            setShowReservationModal(false);
            setSelectedVehicle(null);
          }}
          onSubmit={handleReservationSubmit}
        />
      )}

      {/* Vehicule Modal */}
      {showVehicleModal && (
        <VehicleModal
          vehicle={editingVehicle || undefined}
          onClose={() => {
            setShowVehicleModal(false);
            setEditingVehicle(null);
          }}
          onSubmit={handleVehicleSubmit}
        />
      )}

      {/* Annulation Reservation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showCancelConfirmDialog}
        title="Annuler la réservation"
        message="Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible."
        confirmText="Annuler la réservation"
        cancelText="Conserver"
        onConfirm={confirmCancelReservation}
        onCancel={() => {
          setShowCancelConfirmDialog(false);
          setCancelReservationId(null);
        }}
        variant="destructive"
      />

      {/* Deconnexion Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showLogoutConfirmDialog}
        title="Confirmer la déconnexion"
        message="Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte."
        confirmText="Se déconnecter"
        cancelText="Annuler"
        onConfirm={onLogout}
        onCancel={() => setShowLogoutConfirmDialog(false)}
        variant="destructive"
      />

      {/* Delete Vehicle Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteVehicleConfirmDialog}
        title="Supprimer le véhicule"
        message={`Êtes-vous sûr de vouloir supprimer le véhicule "${deleteVehicleData?.brand} ${deleteVehicleData?.model}" (${deleteVehicleData?.plate_number}) ? Cette action est irréversible et supprimera également toutes les réservations associées à ce véhicule.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteVehicle}
        onCancel={() => {
          setShowDeleteVehicleConfirmDialog(false);
          setDeleteVehicleData(null);
        }}
        variant="destructive"
      />

      {/* Password Change Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showPasswordConfirmDialog}
        title="Confirmer le changement de mot de passe"
        message="Êtes-vous sûr de vouloir modifier votre mot de passe ? Vous serez automatiquement déconnecté après le changement."
        confirmText="Continuer"
        cancelText="Annuler"
        onConfirm={confirmPasswordChange}
        onCancel={() => setShowPasswordConfirmDialog(false)}
        variant="primary"
      />

      {/* Password Modal */}
      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}

      {/* Approve Reservation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showApproveConfirmDialog}
        title="Approuver la réservation"
        message="Êtes-vous sûr de vouloir approuver cette réservation ? La réservation sera confirmée et le véhicule sera réservé pour les dates spécifiées."
        confirmText="Approuver"
        cancelText="Annuler"
        onConfirm={confirmApproveReservation}
        onCancel={() => {
          setShowApproveConfirmDialog(false);
          setApproveReservationId(null);
        }}
        variant="primary"
      />

      {/* Disapprove Reservation Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDisapproveConfirmDialog}
        title="Désapprouver la réservation"
        message="Êtes-vous sûr de vouloir désapprouver cette réservation ? La réservation sera annulée définitivement."
        confirmText="Désapprouver"
        cancelText="Annuler"
        onConfirm={confirmDisapproveReservation}
        onCancel={() => {
          setShowDisapproveConfirmDialog(false);
          setDisapproveReservationId(null);
        }}
        variant="destructive"
      />
    </div>
  );
}
