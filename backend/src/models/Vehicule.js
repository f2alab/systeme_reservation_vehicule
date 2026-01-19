
// Ajout de véhicule
export const createVehicle = async (db, { brand, model, plate_number, color, seats, fuel_type }) => {
  const stmt = await db.prepare(
    'INSERT INTO vehicules (brand, model, plate_number, color, seats, fuel_type) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const result = await stmt.run(brand, model, plate_number, color, seats, fuel_type);
  return { id: result.lastID, brand, model, plate_number, color, seats, fuel_type };
};

// Ajout de véhicules par défaut
export const createDefaultVehicles = async (db) => {
  const defaultVehicles = [
    { brand: 'Toyota', model: 'Corolla', plate_number: 'TG-1234-AB', color: 'Blanc', seats: 5, fuel_type: 'gasoline' },
    { brand: 'Nissan', model: 'Leaf', plate_number: 'TG-7890-IJ', color: 'Bleu', seats: 5, fuel_type: 'electric' },
    { brand: 'Renault', model: 'Kwid', plate_number: 'TG-9012-EF', color: 'Rouge', seats: 4, fuel_type: 'diesel' },
    { brand: 'Peugeot', model: '208', plate_number: 'TG-3456-GH', color: 'Gris', seats: 4, fuel_type: 'gasoline' },
    
  ];

  // Compter les véhicules existants
  const count = await db.get('SELECT COUNT(*) as count FROM vehicules');
  
  // S'il y a déjà des véhicules, ne rien faire
  if (count.count > 0) {
    console.log('Ajout de véhicules par défaut ignoré.');
    return;
  }

  // Insérer les véhicules par défaut
  for (const vehicle of defaultVehicles) {
    await createVehicle(db, vehicle);
  }
  console.log(`${defaultVehicles.length} véhicules par défaut créés.`);
};

// Récupération de tous les véhicules
export const getAllVehicles = async (db) => {
  const stmt = await db.prepare('SELECT * FROM vehicules');
  return await stmt.all();
};

// Récupération d'un véhicule par ID
export const getVehicleById = async (db, id) => {
  const stmt = await db.prepare('SELECT * FROM vehicules WHERE id = ?');
  return await stmt.get(id);
};

// Récupération d'un véhicule par plaque d'immatriculation
export const getVehicleByPlateNumber = async (db, plate_number) => {
  const stmt = await db.prepare('SELECT * FROM vehicules WHERE plate_number = ?');
  return await stmt.get(plate_number);
};

// Mettre à jour le statut d'un véhicule
export const updateVehicleStatus = async (db, id, status) => {
  const stmt = await db.prepare('UPDATE vehicules SET updated_at = CURRENT_TIMESTAMP, status = ? WHERE id = ?');
  return await stmt.run(status, id);
};

// Mettre à jour les informations d'un véhicule
export const updateVehicleInfo = async (db, id, { brand, model, plate_number, color, seats, fuel_type, status }) => {
  const stmt = await db.prepare('UPDATE vehicules SET updated_at = CURRENT_TIMESTAMP, brand = ?, model = ?, plate_number = ?, color = ?, seats = ?, fuel_type = ?, status = ? WHERE id = ?');
  return await stmt.run(brand, model, plate_number, color, seats, fuel_type, status, id);
};

// Supprimer un véhicule
export const deleteVehicle = async (db, id) => {
  const stmt = await db.prepare('DELETE FROM vehicules WHERE id = ?');
  return await stmt.run(id);
};