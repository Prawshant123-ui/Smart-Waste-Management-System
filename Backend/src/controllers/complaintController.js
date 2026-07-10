const prisma = require("../config/prisma");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

const createComplaint = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Complaint image is required" });
    }

    const { binId, description } = req.body;

    const result = await uploadToCloudinary(req.file.buffer, "agrishield/complaints");

    const complaint = await prisma.complaint.create({
      data: {
        citizenId: req.user.id,
        binId: binId || null,
        image: result.secure_url,
        description,
      },
    });

    return res.status(201).json({ message: "Complaint submitted", complaint });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to submit complaint" });
  }
};

const getMyComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      where: { citizenId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { bin: true },
    });

    return res.status(200).json({ complaints });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

const getAllComplaints = async (req, res) => {
  try {
    const { status } = req.query;

    const complaints = await prisma.complaint.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: { citizen: { select: { name: true, phone: true } }, bin: true },
    });

    return res.status(200).json({ complaints });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch complaints" });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { bin: true, collection: true },
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    return res.status(200).json({ complaint });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch complaint" });
  }
};

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.citizenId !== req.user.id) {
      return res.status(403).json({ message: "Not your complaint" });
    }

    if (complaint.status !== "PENDING") {
      return res.status(400).json({ message: "Cannot edit an already-processed complaint" });
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: { description },
    });

    return res.status(200).json({ message: "Complaint updated", complaint: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update complaint" });
  }
};

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (complaint.citizenId !== req.user.id) {
      return res.status(403).json({ message: "Not your complaint" });
    }

    if (complaint.status !== "PENDING") {
      return res.status(400).json({ message: "Cannot delete an already-processed complaint" });
    }

    await prisma.complaint.delete({ where: { id } });

    return res.status(200).json({ message: "Complaint deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete complaint" });
  }
};

const approveComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    const updated = await prisma.complaint.update({
      where: { id },
      data: { status: "APPROVED", priority: priority || complaint.priority },
    });

    return res.status(200).json({ message: "Complaint approved", complaint: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to approve complaint" });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  approveComplaint,
};