
// Effecuter une nouvelle reservation
export const createReservation = async (db, { user_id, vehicle_id, start_date, end_date }) => {
  const stmt = await db.prepare(
    'INSERT INTO reservations (user_id, vehicle_id, start_date, end_date) VALUES (?, ?, ?, ?)'
  );
  const result = await stmt.run(user_id, vehicle_id, start_date, end_date);
  return { id: result.lastID, user_id, vehicle_id, start_date, end_date };
};

// Vérifier les réservations qui se chevauchent
export const findOverlappingReservations = async (db, vehicle_id, start_date, end_date) => {
  // Vérifie s'il existe une réservation confirmée qui chevauche [start_date, end_date]
  const stmt = await db.prepare(`
    SELECT 1 FROM reservations
    WHERE vehicle_id = ?
      AND status = 'confirmed'
      AND start_date < ?
      AND end_date > ?
  `);
  return await stmt.get(vehicle_id, end_date, start_date);
};

// Récupérer les réservations d'un utilisateur avec les détails du véhicule
export const getReservationsWithUserId = async (db, user_id) => {
  const stmt = await db.prepare(`
    SELECT r.*, v.brand, v.model, v.plate_number
    FROM reservations r
    JOIN vehicles v ON r.vehicle_id = v.id
    WHERE r.user_id = ?
    ORDER BY r.start_date DESC
  `);
  return await stmt.all(user_id);
};

// Rrécupérer toutes les réservations avec détails
export const getAllReservationsWithDetails = async (db) => {
  const stmt = await db.prepare(`
    SELECT 
      r.id, r.start_date, r.end_date, r.status,
      u.name AS user_name, u.email,
      v.brand, v.model, v.plate_number
    FROM reservations r
    JOIN users u ON r.user_id = u.id
    JOIN vehicles v ON r.vehicle_id = v.id
    ORDER BY r.start_date
  `);
  return await stmt.all();
};