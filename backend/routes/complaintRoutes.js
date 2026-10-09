const express = require("express");
const multer = require("multer");

const {
  protect,
  studentOnly,
  adminOnly,
} = require("../middleware/authMiddleware");

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaintStatus,
  getStats,
} = require("../controllers/complaintController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Student
router.post(
  "/",
  protect,
  studentOnly,
  upload.array("attachments", 5),
  createComplaint
);

router.get(
  "/mine",
  protect,
  studentOnly,
  getMyComplaints
);

// Admin
router.get(
  "/all",
  protect,
  adminOnly,
  getAllComplaints
);

router.get(
  "/stats",
  protect,
  adminOnly,
  getStats
);

// Common
router.get(
  "/:id",
  protect,
  getComplaintById
);

// Admin update
router.put(
  "/:id/status",
  protect,
  adminOnly,
  upload.array("resolutionAttachments", 5),
  updateComplaintStatus
);

module.exports = router;