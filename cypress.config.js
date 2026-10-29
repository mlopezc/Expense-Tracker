const path = require('path');
const { defineConfig } = require('cypress');
// sqlite3 is only installed in server/; reuse it instead of adding a copy.
const sqlite3 = require('./server/node_modules/sqlite3');

// Same file the E2E server opens (see the e2e:server script). It is a
// throwaway database, never the development one.
const E2E_DB_PATH = path.join(__dirname, 'server', '.e2e', 'e2e.db');

function withDatabase(work) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(E2E_DB_PATH, (openError) => {
      if (openError) return reject(openError);
      work(db, (workError, result) => {
        db.close(() => (workError ? reject(workError) : resolve(result)));
      });
    });
  });
}

module.exports = defineConfig({
  e2e: {
    // 127.0.0.1, not localhost: Vite would otherwise bind only to IPv6 (::1)
    // while Cypress connects over IPv4.
    baseUrl: 'http://127.0.0.1:3000',
    viewportWidth: 1280,
    viewportHeight: 800,
    env: {
      apiUrl: 'http://localhost:3001/api',
    },
    setupNodeEvents(on) {
      on('task', {
        // Leaves only the seeded global categories, so every test starts clean.
        'db:reset'() {
          return withDatabase((db, done) => {
            db.exec(
              `DELETE FROM expenses;
               DELETE FROM categories WHERE user_id IS NOT NULL;
               DELETE FROM users;`,
              (error) => done(error, null)
            );
          });
        },
        'db:countExpenses'() {
          return withDatabase((db, done) => {
            db.get('SELECT COUNT(*) AS count FROM expenses', (error, row) => done(error, row && row.count));
          });
        },
      });
    },
  },
});
