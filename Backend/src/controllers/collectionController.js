const prisma = require("../config/prisma");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");

const assignTask = async (req, res) => {
  try {
    const { complaintId, collectorId, vehicleId, binId } = req.body;

    const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    if (complaint.status !== "APPROVED") {
      return res.status(400).json({ message: "Complaint must be approved before assignment" });
    }

    const collector = await prisma.user.findUnique({ where: { id: collectorId } });
    if (!collector || collector.role !== "COLLECTOR") {
      return res.status(400).json({ message: "Invalid collector" });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) {
      return res.status(400).json({ message: "Invalid vehicle" });
    }

    const collection = await prisma.collection.create({
      data: {
        collectorId,
        vehicleId,
        binId,
        complaintId,
        startTime: new Date(),
      },
    });

    await prisma.complaint.update({
      where: { id: complaintId },
      data: { status: "ASSIGNED" },
    });

    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: "IN_USE" },
    });

    return res.status(201).json({ message: "Task assigned", collection });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to assign task" });
  }
};

const getMyTasks = async (req, res) => {
  try {
    const tasks = await prisma.collection.findMany({
      where: { collectorId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { bin: true, vehicle: true, complaint: true },
    });

    return res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

const completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Completion photo is required" });
    }

    const task = await prisma.collection.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.collectorId !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    const result = await uploadToCloudinary(req.file.buffer, "agrishield/completions");

    const updatedTask = await prisma.collection.update({
      where: { id },
      data: {
        status: "COMPLETED",
        endTime: new Date(),
        completionPhoto: result.secure_url,
      },
    });

    await prisma.bin.update({
      where: { id: task.binId },
      data: { status: "NORMAL", lastCollected: new Date() },
    });

    if (task.complaintId) {
      await prisma.complaint.update({
        where: { id: task.complaintId },
        data: { status: "RESOLVED" },
      });
    }

    await prisma.vehicle.update({
      where: { id: task.vehicleId },
      data: { status: "AVAILABLE" },
    });

    return res.status(200).json({ message: "Task completed", task: updatedTask });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to complete task" });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["IN_PROGRESS"].includes(status)) {
      return res.status(400).json({
        message: "Use this endpoint only to mark a task as IN_PROGRESS. Use /complete to finish a task.",
      });
    }

    const task = await prisma.collection.findUnique({ where: { id } });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    if (task.collectorId !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }
    if (task.status !== "ASSIGNED") {
      return res.status(400).json({ message: `Cannot move task from ${task.status} to IN_PROGRESS` });
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: { status: "IN_PROGRESS" },
    });

    return res.status(200).json({ message: "Task marked in progress", task: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update task status" });
  }
};

module.exports = { assignTask, getMyTasks, completeTask, updateTaskStatus };

