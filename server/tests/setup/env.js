// Runs before each test file: every file gets its own in-memory database
// and a known JWT secret, and morgan stays quiet.
process.env.NODE_ENV = 'test';
process.env.SQLITE_DB_PATH = ':memory:';
process.env.JWT_SECRET = 'test-secret';
