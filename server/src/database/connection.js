const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// SQLITE_DB_PATH may be ':memory:' (used by tests) or a path relative to the
// server/ folder. Without it, the database lives next to this file.
function resolveDbPath() {
  const configured = process.env.SQLITE_DB_PATH;
  if (!configured) {
    return path.join(__dirname, 'expense_tracker.db');
  }
  if (configured === ':memory:') {
    return configured;
  }
  return path.resolve(__dirname, '..', '..', configured);
}

class Database {
  constructor() {
    this.db = null;
  }

  async connect() {
    this.dbPath = resolveDbPath();
    if (this.dbPath !== ':memory:') {
      fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
    }

    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error connecting to database:', err.message);
          reject(err);
        } else {
          console.log('Connected to SQLite database');
          this.initializeTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async initializeTables() {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      this.db.exec(schema, async (err) => {
        if (err) {
          console.error('Error initializing tables:', err.message);
          reject(err);
        } else {
          console.log('Database tables initialized');

          // Older versions stored expense dates as epoch milliseconds;
          // convert them to YYYY-MM-DD so filters and sorting work.
          try {
            await this.run(
              "UPDATE expenses SET date = strftime('%Y-%m-%d', date / 1000, 'unixepoch') WHERE typeof(date) IN ('integer', 'real')"
            );
          } catch (migrationError) {
            console.error('Date normalization error:', migrationError);
          }

          // Seed default data
          try {
            const Seeder = require('./seeder');
            await Seeder.seedAll();
          } catch (seedError) {
            console.error('Seeding error:', seedError);
          }
          
          resolve();
        }
      });
    });
  }

  async run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}

const database = new Database();

module.exports = database;