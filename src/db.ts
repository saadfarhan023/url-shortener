import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('urls.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS urls (
      id TEXT PRIMARY KEY,
      original TEXT NOT NULL
    )
  `);
});

export default db;
