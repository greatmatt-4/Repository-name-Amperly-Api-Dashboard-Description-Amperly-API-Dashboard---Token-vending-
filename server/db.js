const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'data.sqlite');
const db = new Database(dbPath);

// Create tables if they don't exist
db.pragma('journal_mode = WAL');

db.prepare(`CREATE TABLE IF NOT EXISTS tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL,
  meterNo TEXT,
  response TEXT,
  signalStrength REAL,
  token_hash TEXT,
  created_at TEXT,
  hasLight INTEGER,
  voltage REAL
)`).run();

db.prepare(`CREATE TABLE IF NOT EXISTS confirmations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ref TEXT NOT NULL,
  hasLight INTEGER,
  created_at TEXT
)`).run();

module.exports = db;
