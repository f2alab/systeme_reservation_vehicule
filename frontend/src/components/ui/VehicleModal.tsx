import { useState, useEffect } from "react";
import type { Vehicule } from "../../types/models";
import { useToast } from "../../contexts/ToastContext";
import ConfirmationDialog from "./ConfirmationDialog";

interface VehicleModalProps {
  vehicle?: Vehicule; 
  onClose: () => void;
  onSubmit: (vehicleData: Omit<Vehicule, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function VehicleModal({
  vehicle,
  onClose,
  onSubmit,
}: VehicleModalProps) {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    plate_number: '',
    fuel_type: 'gasoline' as 'gasoline' | 'diesel' | 'electric' | 'hybrid',
    color: '',
    seats: 5,
    status: 'operational' as 'operational' | 'maintenance',
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { showToast } = useToast();
  const isEditing = !!vehicle;

  useEffect(() => {
    if (vehicle) {
      setFormData({
        brand: vehicle.brand,
        model: vehicle.model,
        plate_number: vehicle.plate_number,
        fuel_type: vehicle.fuel_type,
        color: vehicle.color,
        seats: vehicle.seats,
        status: vehicle.status,
      });
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.brand.trim() || !formData.model.trim() || !formData.plate_number.trim() || !formData.color.trim()) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    if (formData.seats < 1 || formData.seats > 20) {
      showToast("Le nombre de sièges doit être entre 1 et 20", "error");
      return;
    }

    // Afficher la boîte de dialogue de confirmation
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Modifier le Véhicule' : 'Ajouter un Véhicule'}
            </h2>
            {isEditing && (
              <p className="text-gray-500 text-sm">
                {vehicle.brand} {vehicle.model}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Brand et Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marque *
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                placeholder="Ex: Tesla"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modèle *
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="Ex: Model 3"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
                required
              />
            </div>
          </div>

          {/* Plate Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Immatriculation *
            </label>
            <input
              type="text"
              value={formData.plate_number}
              onChange={(e) => handleChange('plate_number', e.target.value)}
              placeholder="Ex: AB-123-CD"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
              required
            />
          </div>

          {/* Fuel Type and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de Carburant
              </label>
              <select
                value={formData.fuel_type}
                onChange={(e) => handleChange('fuel_type', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              >
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
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              >
                <option value="operational">Opérationnel</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          {/* Color and Seats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur *
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="Ex: Blanc"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Sièges
              </label>
              <input
                type="number"
                value={formData.seats}
                onChange={(e) => handleChange('seats', parseInt(e.target.value) || 5)}
                min="1"
                max="20"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-200 text-gray-900 rounded-lg transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold rounded-lg transition"
            >
              {loading ? (isEditing ? "Modification..." : "Ajout...") : (isEditing ? "Modifier" : "Ajouter")}
            </button>
          </div>
        </form>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          title={isEditing ? 'Confirmer la modification' : 'Confirmer l\'ajout'}
          message={`Êtes-vous sûr de vouloir ${isEditing ? 'modifier' : 'ajouter'} ce véhicule ?`}
          confirmText={isEditing ? 'Modifier' : 'Ajouter'}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmDialog(false)}
          loading={loading}
          variant="primary"
        />
      </div>
    </div>
  );
}
