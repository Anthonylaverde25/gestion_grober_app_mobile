import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'gestion_grober.db';

export const initDatabase = async () => {
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Table for offline yields queue
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS pending_yields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id TEXT NOT NULL,
      yield_percentage REAL NOT NULL,
      reported_at TEXT NOT NULL,
      status TEXT DEFAULT 'pending'
    );
  `);

  return db;
};

export const getDatabase = async () => {
  return await SQLite.openDatabaseAsync(DATABASE_NAME);
};
