import React from 'react';
import type { Vehicule } from '../../types/models';
import { CarFront, Edit, Trash2 } from 'lucide-react';

interface VehicleCardProps {
    vehicle: Vehicule;
    onReserve: (vehicle: Vehicule) => void;
    isAdmin: boolean;
    userStatus?: string;
    onEdit: (vehicle: Vehicule) => void;
    onDelete: (vehicle: Vehicule) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onReserve, isAdmin, userStatus, onEdit, onDelete }) => {
    const translateFuelType = (fuelType: string) => {
        switch (fuelType) {
            case 'electric':
                return 'Électrique';
            case 'hybrid':
                return 'Hybride';
            case 'diesel':
                return 'Diesel';
            case 'gasoline':
                return 'Essence';
            default:
                return fuelType;
        }
    };

    const getFuelTypeColor = (fuelType: string) => {
        switch (fuelType) {
            case 'electric':
                return 'bg-blue-100 text-blue-700 border-blue-300';
            case 'hybrid':
                return 'bg-purple-100 text-purple-700 border-purple-300';
            case 'diesel':
                return 'bg-orange-100 text-orange-700 border-orange-300';
            default:
                return 'bg-amber-100 text-amber-700 border-amber-300';
        }
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case 'operational':
                return 'Opérationnel';
            case 'maintenance':
                return 'Maintenance';
            default:
                return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'operational':
                return 'bg-green-100 text-green-700 border-green-300';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-300';
        }
    };

    return (
        <div className="bg-white border border-gray-300 rounded-xl overflow-hidden hover:border-gray-400 transition group shadow-sm hover:shadow-md">
            <div className="h-48 bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-100 transition">
                <CarFront className="w-24 h-24 text-blue-600" />
            </div>
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">
                            {vehicle.brand} {vehicle.model}
                        </h3>
                        <p className="text-sm text-gray-500">{vehicle.plate_number}</p>
                        <div className="flex gap-2 mt-2">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getFuelTypeColor(
                                    vehicle.fuel_type
                                )}`}
                            >
                                {translateFuelType(vehicle.fuel_type)}
                            </span>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                                    vehicle.status
                                )}`}
                            >
                                {translateStatus(vehicle.status)}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6 pt-4 border-t border-gray-200">
                    <div>
                        <p className="text-xs text-gray-500">Couleur</p>
                        <p className="text-sm font-medium text-gray-900">{vehicle.color}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Sièges</p>
                        <p className="text-sm font-medium text-gray-900">{vehicle.seats} personnes</p>
                    </div>
                </div>
                {isAdmin ? (
                    <div className="flex gap-2">
                        <button
                            onClick={() => onEdit(vehicle)}
                            className="flex-1 bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            Modifier
                        </button>
                        <button
                            onClick={() => onDelete(vehicle)}
                            className="flex-1 bg-red-100 text-red-700 border border-red-300 hover:bg-red-200 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" />
                            Supprimer
                        </button>
                    </div>
                ) : (
                    userStatus === 'active' ? (
                        <button
                            onClick={() => onReserve(vehicle)}
                            className="w-full bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 transform hover:scale-105"
                        >
                            Réserver Maintenant
                        </button>
                    ) : (
                        <div className="w-full bg-gray-300 text-gray-500 font-semibold py-2 rounded-lg text-center cursor-not-allowed">
                            Compte inactif - Réservation impossible
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default VehicleCard;
