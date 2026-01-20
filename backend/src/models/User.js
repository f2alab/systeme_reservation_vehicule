
// Ajouter un nouvel utilisateur
export const createUser = async (db, { name, email, password, role }) => {
  const stmt = await db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  );
  const result = await stmt.run(name, email, password, role);
  return { id: result.lastID, name, email, role };
};

// Ajouter compte par defaut pour l'admin
export const createDefaultUser = async (db) => {
  const name = 'Administrateur';
  const defaultEmail = 'admin@admin.tg';
  const defaultPassword = '$2b$10$FS9bh5bIilkZZQD7L2Gwi.Jjy5NXKamBU4HDy1/rP9pHCEb/uAarK'; // mot de passe haché pour "superadmin"
  const role = 'admin';

  const existingUser = await findUserByEmail(db, defaultEmail);
  if (!existingUser) {
    await createUser(db, { name, email: defaultEmail, password: defaultPassword, role });
  }
};
// Trouver un utilisateur par email
export const findUserByEmail = async (db, email) => {
  const stmt = await db.prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
  return await stmt.get(email);
};

// Trouver un utilisateur par ID
export const findUserById = async (db, id) => {
  const stmt = await db.prepare('SELECT id, name, email, role FROM users WHERE id = ?');
  return await stmt.get(id);
};

// Mettre à jour status utilisateur (seulement admin peut le faire)
export const updateUserStatus = async (db, id, status) => {
  const stmt = await db.prepare('UPDATE users SET updated_at = CURRENT_TIMESTAMP, status = ? WHERE id = ?');
  return await stmt.run(status, id);
};

// Mettre à jour le mot de passe de l'utilisateur
export const updatePasswordUser = async (db, id, hashedPassword) => {
  const stmt = await db.prepare('UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  const result = await stmt.run(hashedPassword, id);
  return result.changes > 0; // Retourne true si une ligne a été modifiée
};

// Obtenir tous les utilisateurs (seulement admin)
export const getAllUsers = async (db) => {
  const stmt = await db.prepare('SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE role != "admin" ORDER BY created_at DESC');
  return await stmt.all();
};
