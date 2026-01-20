import React from 'react';
import { X } from 'lucide-react';
import type { Reservation, Vehicule } from '../../types/models';

interface ReservationCardProps {
    reservation: Reservation;
    vehicle: Vehicule;
    onCancel: (reservationId: number) => void;
    user?: { name: string; email: string };
}

const ReservationCard: React.FC<ReservationCardProps> = ({ reservation, vehicle, onCancel, user }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white border border-gray-300 rounded-xl p-6 hover:border-gray-400 transition shadow-sm">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                    </h3>
                    <p className="text-sm text-gray-500">{vehicle.plate_number}</p>
                    {user && (
                        <p className="text-sm text-blue-600 font-medium mt-1">
                            Réservé par: {user.name}
                        </p>
                    )}
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        reservation.status === 'confirmed'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                    }`}
                >
                    {reservation.status === 'confirmed' ? 'Confirmée' : 'Annulée'}
                </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pt-4 border-t border-gray-200">
                <div>
                    <p className="text-xs text-gray-500">Du</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(reservation.start_date)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Au</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(reservation.end_date)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Type de Carburant</p>
                    <p className="text-sm font-medium text-gray-900 capitalize">{vehicle.fuel_type}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Sièges</p>
                    <p className="text-sm font-medium text-gray-900">{vehicle.seats} personnes</p>
                </div>
            </div>
            {reservation.status === 'confirmed' && (
                <button
                    onClick={() => onCancel(reservation.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 border border-red-300 rounded-lg hover:bg-red-200 transition"
                >
                    <X className="w-4 h-4 mr-2 inline" /> Annuler la Réservation
                </button>
            )}
        </div>
    );
};

export default ReservationCard;
