
// Effecuter une nouvelle reservation
export const createReservation = async (db, { user_id, vehicle_id, start_date, end_date }) => {
  const stmt = await db.prepare(
    'INSERT INTO reservations (user_id, vehicule_id, start_date, end_date) VALUES (?, ?, ?, ?)'
  );
  const result = await stmt.run(user_id, vehicle_id, start_date, end_date);
  return { id: result.lastID, user_id, vehicle_id, start_date, end_date };
};

// Vérifier les réservations qui se chevauchent pour un véhicule
export const findOverlappingReservations = async (db, vehicle_id, start_date, end_date) => {
  // Vérifie s'il existe une réservation confirmée qui chevauche [start_date, end_date]
  const stmt = await db.prepare(`
    SELECT 1 FROM reservations
    WHERE vehicule_id = ?
      AND status = 'confirmed'
      AND start_date < ?
      AND end_date > ?
  `);
  return await stmt.get(vehicle_id, end_date, start_date);
};

// Vérifier les réservations qui se chevauchent pour un utilisateur
export const findUserOverlappingReservations = async (db, user_id, start_date, end_date) => {
  // Vérifie s'il existe une réservation confirmée de l'utilisateur qui chevauche [start_date, end_date]
  const stmt = await db.prepare(`
    SELECT 1 FROM reservations
    WHERE user_id = ?
      AND status = 'confirmed'
      AND start_date < ?
      AND end_date > ?
  `);
  return await stmt.get(user_id, end_date, start_date);
};

// Récupérer les réservations d'un utilisateur avec les détails du véhicule
export const getReservationsWithUserId = async (db, user_id) => {
  const stmt = await db.prepare(`
    SELECT r.*, v.brand, v.model, v.plate_number
    FROM reservations r
    JOIN vehicules v ON r.vehicule_id = v.id
    WHERE r.user_id = ?
    ORDER BY r.id DESC
  `);
  return await stmt.all(user_id);
};

// Annuler une réservation
export const cancelReservation = async (db, reservation_id, user_id) => {
  const stmt = await db.prepare(`
    UPDATE reservations
    SET status = 'cancelled' WHERE id = ? AND user_id = ? AND status = 'confirmed'
  `);
  const result = await stmt.run(reservation_id, user_id);
  return result.changes > 0; // Retourne true si une ligne a été modifiée
};

// Rrécupérer toutes les réservations avec détails
export const getReservationsWithDetails = async (db) => {
  const stmt = await db.prepare(`
    SELECT
      r.id, r.user_id, r.vehicule_id, r.start_date, r.end_date, r.status, r.created_at,
      u.name AS user_name, u.email,
      v.brand, v.model, v.plate_number, v.color, v.seats, v.fuel_type, v.status AS vehicle_status
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    JOIN vehicules v ON r.vehicule_id = v.id
    ORDER BY r.id DESC
  `);
  return await stmt.all();
};
