// Utilisateur
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Véhicule
export interface Vehicule {
  id: number;
  brand: string;
  model: string;
  plate_number: string;
  color: string;
  seats: number;
  fuel_type: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  status: 'operational' | 'maintenance';
  createdAt: string;
  updatedAt: string;
}

// Réservation
export interface Reservation {
  id: number;
  user_id: number;
  vehicule_id: number;
  start_date: string;
  end_date: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

// Réservation avec détails complets
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
