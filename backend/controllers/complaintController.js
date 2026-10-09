const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
  try {
    const {
      title,
      category,
      department,
      location,
      description,
    } = req.body;

    if (
      !title ||
      !category ||
      !department ||
      !location ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all complaint fields",
      });
    }

    const attachments = (req.files || []).map(
      (file) => `/uploads/${file.filename}`
    );

    const complaint = await Complaint.create({
      student: req.user.id,
      title,
      category,
      department,
      location,
      description,
      attachments,
      status: "Submitted",

      history: [
        {
          status: "Submitted",
          message: "Complaint submitted by student",
        },
      ],
    });

    const populatedComplaint = await complaint.populate(
      "student",
      "name email studentId department"
    );

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint: populatedComplaint,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to submit complaint",
    });
  }
};

exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user.id,
    })
      .populate("student", "name email studentId department")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch complaints",
    });
  }
};

exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email studentId department")
      .sort({ createdAt: -1 });

    console.log("=================================");
    console.log("ADMIN COMPLAINTS FROM MONGODB:");
    console.log("COUNT:", complaints.length);
    console.log(complaints);
    console.log("=================================");

    res.json(complaints);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch complaints",
    });
  }
};

exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      "student",
      "name email studentId department"
    );

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    if (
      req.user.role === "student" &&
      complaint.student._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.json(complaint);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch complaint",
    });
  }
};

exports.updateComplaintStatus = async (req, res) => {
  try {
    const {
      status,
      adminResponse,
    } = req.body;

    const validStatuses = [
      "Submitted",
      "Assigned",
      "In Progress",
      "Resolved",
      "Rejected",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        message: "Complaint not found",
      });
    }

    const resolutionAttachments = (req.files || []).map(
      (file) => `/uploads/${file.filename}`
    );

    complaint.status = status;

    if (adminResponse !== undefined) {
      complaint.adminResponse = adminResponse;
    }

    if (resolutionAttachments.length > 0) {
      complaint.resolutionAttachments = resolutionAttachments;
    }

    complaint.history.push({
      status,
      message:
        adminResponse ||
        `Complaint status changed to ${status}`,
      updatedAt: new Date(),
    });

    await complaint.save();

    const updatedComplaint = await complaint.populate(
      "student",
      "name email studentId department"
    );

    res.json({
      message: "Complaint updated successfully",
      complaint: updatedComplaint,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update complaint",
    });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const submitted = await Complaint.countDocuments({
      status: "Submitted",
    });

    const assigned = await Complaint.countDocuments({
      status: "Assigned",
    });

    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    const rejected = await Complaint.countDocuments({
      status: "Rejected",
    });

    res.json({
      total,
      submitted,
      assigned,
      inProgress,
      resolved,
      rejected,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch statistics",
    });
  }
};