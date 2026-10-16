require('dotenv').config();

const app = require('./src/app');
const database = require('./src/database/connection');

const PORT = process.env.PORT || 3001;

// Initialize database and start server
async function startServer() {
  try {
    await database.connect();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
