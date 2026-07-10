const prisma = require("../config/prisma");

const createBin = async (req, res) => {
  try {
    const { latitude, longitude, address, capacity } = req.body;

    const bin = await prisma.bin.create({
      data: {
        latitude,
        longitude,
        address,
        capacity,
        createdBy: req.user.id,
      },
    });

    return res.status(201).json({ message: "Bin created", bin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to create bin" });
  }
};

const getBins = async (req, res) => {
  try {
    const { status } = req.query;

    const bins = await prisma.bin.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ bins });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch bins" });
  }
};

const getBinById = async (req, res) => {
  try {
    const { id } = req.params;

    const bin = await prisma.bin.findUnique({ where: { id } });
    if (!bin) {
      return res.status(404).json({ message: "Bin not found" });
    }

    return res.status(200).json({ bin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch bin" });
  }
};

const updateBin = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.bin.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Bin not found" });
    }

    const bin = await prisma.bin.update({
      where: { id },
      data: req.body,
    });

    return res.status(200).json({ message: "Bin updated", bin });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update bin" });
  }
};

const deleteBin = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.bin.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Bin not found" });
    }

    await prisma.bin.delete({ where: { id } });

    return res.status(200).json({ message: "Bin deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete bin" });
  }
};

module.exports = { createBin, getBins, getBinById, updateBin, deleteBin };