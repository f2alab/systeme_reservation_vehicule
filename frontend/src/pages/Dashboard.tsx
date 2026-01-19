// components/Dashboard.tsx
import { useState, useEffect } from 'react';
import type { Reservation, User, Vehicule } from '../types/models';
import { useToast } from '../contexts/ToastContext';
import ReservationModal from '../components/ui/ReservationModal';
import VehicleModal from '../components/ui/VehicleModal';
import PasswordModal from '../components/ui/PasswordModal';
import VehicleCard from '../components/ui/VehiculeCard';
import ReservationCard from '../components/ui/ReservationCard';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { Car, ChevronDown, ChevronUp } from 'lucide-react';

// Mock data
const MOCK_VEHICLES: Vehicule[] = [
  {
    id: 1,
    brand: 'Tesla',
    model: 'Model 3',
    plate_number: 'EV-1234',
    fuel_type: 'electric',
    color: 'Blanc',
    seats: 5,
    status: 'operational',
    createdAt: '2026-01-25T12:00:00Z',
    updatedAt: '2026-01-25T12:00:00Z',
  },
  {
    id: 2,
    brand: 'Toyota',
    model: 'Prius',
    plate_number: 'HY-5678',
    fuel_type: 'hybrid',
    color: 'Argent',
    seats: 5,
    status: 'operational',
    createdAt: '2026-01-20T12:00:00Z',
    updatedAt: '2026-01-20T12:00:00Z',
  },
  {
    id: 3,
    brand: 'Renault',
    model: 'Clio',
    plate_number: 'GA-9012',
    fuel_type: 'gasoline',
    color: 'Rouge',
    seats: 4,
    status: 'operational',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 4,
    brand: 'Peugeot',
    model: '3008',
    plate_number: 'DI-3456',
    fuel_type: 'diesel',
    color: 'Gris',
    seats: 5,
    status: 'operational',
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-01-10T12:00:00Z',
  },
];

let mockReservations: Reservation[] = [
  {
    id: 101,
    user_id: 2,
    vehicule_id: 1,
    start_date: '2026-02-01T00:00:00Z',
    end_date: '2026-02-05T00:00:00Z',
    status: 'confirmed',
    createdAt: '2026-01-15T12:00:00Z',
  },
  {
    id: 102,
    user_id: 2,
    vehicule_id: 2,
    start_date: '2026-01-20T00:00:00Z',
    end_date: '2026-01-22T00:00:00Z',
    status: 'cancelled',
    createdAt: '2026-01-10T12:00:00Z',
  },
];

// Simule la récupération avec délai
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [vehicles, setVehicles] = useState<Vehicule[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicule | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicule | null>(null);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'reservations' | 'profile'>('vehicles');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [vehicleFuelFilter, setVehicleFuelFilter] = useState<string>('all');
  const [vehicleStatusFilter, setVehicleStatusFilter] = useState<string>('all');
  const [reservationSearch, setReservationSearch] = useState('');
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string>('all');
  const [showCancelConfirmDialog, setShowCancelConfirmDialog] = useState(false);
  const [cancelReservationId, setCancelReservationId] = useState<number | null>(null);
  const [showLogoutConfirmDialog, setShowLogoutConfirmDialog] = useState(false);
  const [isVehicleSearchExpanded, setIsVehicleSearchExpanded] = useState(false);
  const [isVehicleStatsExpanded, setIsVehicleStatsExpanded] = useState(false);
  const [isReservationSearchExpanded, setIsReservationSearchExpanded] = useState(false);
  const [isReservationStatsExpanded, setIsReservationStatsExpanded] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchVehicles(), fetchReservations()]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    await delay(400);
    setVehicles(MOCK_VEHICLES);
  };

  const fetchReservations = async () => {
    await delay(400);
    // For admins, show all reservations; for users, show only their own
    const allReservations = isAdmin ? mockReservations : mockReservations.filter((r) => r.user_id === user.id);
    setReservations(allReservations);
  };

  const handleReserve = (vehicle: Vehicule) => {
    setSelectedVehicle(vehicle);
    setShowReservationModal(true);
  };

  const handleReservationSubmit = async (startDate: string, endDate: string) => {
    if (!selectedVehicle) return;

    await delay(500);

    const newId = Math.max(0, ...mockReservations.map((r) => r.id)) + 1;
    const newReservation: Reservation = {
      id: newId,
      user_id: user.id,
      vehicule_id: selectedVehicle.id,
      start_date: startDate,
      end_date: endDate,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    mockReservations.push(newReservation);
    showToast('Réservation créée avec succès !', 'success');
    setShowReservationModal(false);
    setSelectedVehicle(null);
    fetchReservations();
  };

  const handleCancelReservation = (reservationId: number) => {
    setCancelReservationId(reservationId);
    setShowCancelConfirmDialog(true);
  };

  const confirmCancelReservation = async () => {
    if (!cancelReservationId) return;

    setShowCancelConfirmDialog(false);

    await delay(300);

    mockReservations = mockReservations.map((r) =>
      r.id === cancelReservationId ? { ...r, status: 'cancelled' } : r
    );

    showToast('Réservation annulée avec succès !', 'success');
    setCancelReservationId(null);
    fetchReservations();
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
    await delay(500);

    if (editingVehicle) {
      // Edit mode
      const updatedVehicle: Vehicule = {
        ...editingVehicle,
        ...vehicleData,
        updatedAt: new Date().toISOString(),
      };

      // Update in mock data
      const index = MOCK_VEHICLES.findIndex(v => v.id === editingVehicle.id);
      if (index !== -1) {
        MOCK_VEHICLES[index] = updatedVehicle;
      }

      showToast('Véhicule modifié avec succès !', 'success');
    } else {
      // Add mode
      const newId = Math.max(0, ...MOCK_VEHICLES.map(v => v.id)) + 1;
      const newVehicle: Vehicule = {
        ...vehicleData,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      MOCK_VEHICLES.push(newVehicle);
      showToast('Véhicule ajouté avec succès !', 'success');
    }

    setShowVehicleModal(false);
    setEditingVehicle(null);
    fetchVehicles();
  };

  const handlePasswordSubmit = async (newPassword: string) => {
    await delay(500);

    // In a real app, this would update the user's password in the backend
    // For now, we'll just simulate the update
    showToast('Mot de passe modifié avec succès !', 'success');
    setShowPasswordModal(false);
  };

  // Filtering functions
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
  
  if (loading) {
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
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

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
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-400 transition"
          >
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
              <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12M8 11h12M8 15h12M3 7l.75.75M2.75 7H4m-.25 4h1.5M3 15l.75.75M2.75 15H4" />
              </svg>
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
              <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Réservations
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <svg className="inline-block w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
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
                    {isAdmin && (
                      <button
                        onClick={handleAddVehicle}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition flex items-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Ajouter
                      </button>
                    )}
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
                  onEdit={handleEditVehicle}
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
                      <div className="text-2xl font-bold text-green-600">
                        {reservations.filter(r => r.status === 'confirmed').length}
                      </div>
                      <div className="text-sm text-gray-600">En cours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {reservations.filter(r => r.status === 'cancelled').length}
                      </div>
                      <div className="text-sm text-gray-600">Terminés</div>
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
                    />
                  ) : null;
                })
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
                    <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900">
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
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

      {/* Password Modal */}
      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSubmit={handlePasswordSubmit}
        />
      )}
    </div>
  );
}
