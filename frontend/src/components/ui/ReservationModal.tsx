import { useState } from "react";
import type { Vehicule } from "../../types/models";
import { useToast } from "../../contexts/ToastContext";
import ConfirmationDialog from "./ConfirmationDialog";

interface ReservationModalProps {
  vehicule: Vehicule;
  onClose: () => void;
  onSubmit: (startDate: string, endDate: string, motif: string) => void;
}

export default function ReservationModal({
  vehicule: vehicle,
  onClose,
  onSubmit,
}: ReservationModalProps) {
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const {showToast} = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      showToast("Veuillez sélectionner la date de début et de fin", "error");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
      showToast("La date de fin doit être après la date de début", "error");
      return;
    }

    if (!motif.trim()) {
      showToast("Veuillez saisir un motif", "error");
      return;
    }

    // Afficher confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirmDialog(false);
    setLoading(true);
    try {
      await onSubmit(startDate, endDate, motif);
    } finally {
      setLoading(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-300 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Réserver un Véhicule</h2>
            <p className="text-gray-500 text-sm">
              {vehicle.brand} {vehicle.model}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition flex-shrink-0"
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Vehicle Info */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Immatriculation</p>
                <p className="text-sm font-medium text-gray-900">{vehicle.plate_number}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Type de Carburant</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {vehicle.fuel_type}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Couleur</p>
                <p className="text-sm font-medium text-gray-900">{vehicle.color}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Sièges</p>
                <p className="text-sm font-medium text-gray-900">{vehicle.seats} personnes</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date debut */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de Début
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minDate}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
            />
          </div>

          {/* Date fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date de Fin
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
            />
          </div>

          {/* Motif */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motif de la réservation
            </label>
            <textarea
              value={motif}
              onChange={(e) => setMotif(e.target.value)}
              placeholder="Décrivez le motif de votre réservation..."
              rows={3}
              className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              disabled={loading}
            />
          </div>

          {/* Periode */}
          {startDate && endDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-700">
                Durée de la réservation:{" "}
                <span className="font-semibold">
                  {Math.ceil(
                    (new Date(endDate).getTime() -
                      new Date(startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  jour(s)
                </span>
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
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
              {loading ? "Création..." : "Confirmer"}
            </button>
          </div>
          </form>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showConfirmDialog}
          title="Confirmer la réservation"
          message={`Êtes-vous sûr de vouloir réserver le véhicule ${vehicle.brand} ${vehicle.model} (${vehicle.plate_number}) du ${new Date(startDate).toLocaleDateString('fr-FR')} au ${new Date(endDate).toLocaleDateString('fr-FR')} ?`}
          confirmText="Réserver"
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowConfirmDialog(false)}
          loading={loading}
          variant="primary"
        />
      </div>
    </div>
  );
}
