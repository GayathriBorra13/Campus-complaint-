const express = require("express");

const {
  register,
  registerAdmin,
  login,
} = require("../controllers/authController");

const router = express.Router();

// Student registration
router.post("/register", register);

// Admin registration
router.post("/register-admin", registerAdmin);

// Login for both Student and Admin
router.post("/login", login);

module.exports = router;