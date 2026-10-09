const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Create JWT token
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =====================================================
// STUDENT REGISTER
// =====================================================
exports.register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
      department,
    } = req.body;

    if (!name || !email || !password || !studentId || !department) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check whether email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Create student
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      studentId: studentId.trim(),
      department,
      role: "student",
    });

    res.status(201).json({
      message: "Registration successful",

      token: createToken(user),

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Student registration error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};

// =====================================================
// ADMIN REGISTER
// =====================================================
exports.registerAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check whether email already exists
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    // Create admin
    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      studentId: "",
      department: "",
      role: "admin",
    });

    res.status(201).json({
      message: "Admin registration successful",

      token: createToken(admin),

      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        studentId: admin.studentId,
        department: admin.department,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin registration error:", error);

    res.status(500).json({
      message: "Admin registration failed",
    });
  }
};

// =====================================================
// LOGIN - STUDENT + ADMIN
// =====================================================
exports.login = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user from MongoDB
    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Check email and password
    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create token
    const token = createToken(user);

    res.json({
      message: "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        department: user.department,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};