// Load environment variables from .env file
require('dotenv').config();

// Import the Express app
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Ensure database is connected before starting server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  });