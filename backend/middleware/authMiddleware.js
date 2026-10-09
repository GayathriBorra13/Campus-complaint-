const jwt = require("jsonwebtoken");


// ======================================================
// PROTECT ROUTE
// ======================================================

const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const token = parts[1];

    if (!token) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.error(
      "Authentication error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};


// ======================================================
// STUDENT ONLY
// ======================================================

const studentOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role !== "student") {
    return res.status(403).json({
      message: "Student access only",
    });
  }

  next();
};


// ======================================================
// ADMIN ONLY
// ======================================================

const adminOnly = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  protect,
  studentOnly,
  adminOnly,
};