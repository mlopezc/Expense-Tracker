const database = require('../../src/database/connection');

// Opens the in-memory database (schema + default categories) for the
// current test file and closes it when the file finishes.
function useTestDatabase() {
  beforeAll(() => database.connect());
  afterAll(() => database.close());
  return database;
}

module.exports = { useTestDatabase };
