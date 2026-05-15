const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://task-manager-six-sable-94.vercel.app",
    ],
    credentials: true,
  })
)

// Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;