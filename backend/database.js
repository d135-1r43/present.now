const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'wishlist.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS wishlists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    owner_name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS items (
    id TEXT PRIMARY KEY,
    wishlist_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    url TEXT,
    is_purchased BOOLEAN DEFAULT 0,
    purchased_by TEXT,
    purchased_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wishlist_id) REFERENCES wishlists (id)
  )`);
});

module.exports = db;