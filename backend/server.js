
const dns = require("dns");

// Fix MongoDB Atlas SRV DNS issue on Windows
dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./db");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// CORS configuration for local and deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://campus-complaint-xi.vercel.app",
    ],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Uploaded images
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Campus Complaint Management System API is running",
  });
});

// Port configuration
const PORT = process.env.PORT || 5000;

// Connect database and start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();