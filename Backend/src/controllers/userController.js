const bcrypt = require("bcrypt");
const prisma = require("../config/prisma");


const createCollector = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] },
    });
    if (existing) {
      return res.status(409).json({ message: "Email or phone already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const collector = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: "COLLECTOR",
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return res.status(201).json({ message: "Collector created", collector });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create collector" });
  }
};


const listUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const users = await prisma.user.findMany({
      where: role ? { role } : undefined,
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json({ users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

const updateCollector = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing || existing.role !== "COLLECTOR") {
      return res.status(404).json({ message: "Collector not found" });
    }

    if (email || phone) {
      const conflict = await prisma.user.findFirst({
        where: {
          id: { not: id },
          OR: [email ? { email } : undefined, phone ? { phone } : undefined].filter(Boolean),
        },
      });
      if (conflict) {
        return res.status(409).json({ message: "Email or phone already in use" });
      }
    }

    const collector = await prisma.user.update({
      where: { id },
      data: { name, email, phone },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    return res.status(200).json({ message: "Collector updated", collector });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update collector" });
  }
};

const deleteCollector = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing || existing.role !== "COLLECTOR") {
      return res.status(404).json({ message: "Collector not found" });
    }

    const activeTasks = await prisma.collection.count({
      where: { collectorId: id, status: { in: ["ASSIGNED", "IN_PROGRESS"] } },
    });
    if (activeTasks > 0) {
      return res.status(400).json({
        message: "Cannot delete a collector with active tasks. Reassign or complete them first.",
      });
    }

    await prisma.user.delete({ where: { id } });

    return res.status(200).json({ message: "Collector deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete collector" });
  }
};

module.exports = { createCollector, listUsers, updateCollector, deleteCollector };


