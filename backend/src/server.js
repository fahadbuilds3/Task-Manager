// Load environment variables from .env file
require('dotenv').config();

// Import the Express app
const app = require('./app');
// Import the database connection function
const connectDB = require('./config/db');

// Set the port from environment variables or use 5000 by default
const PORT = process.env.PORT || 5000;

// Connect to the database and start the server
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