const prisma = require("../config/prisma");

const createVehicle = async (req, res) => {
  try {
    const { vehicleNumber, driver, fuelType } = req.body;

    const existing = await prisma.vehicle.findUnique({ where: { vehicleNumber } });
    if (existing) {
      return res.status(409).json({ message: "Vehicle already registered" });
    }

    const vehicle = await prisma.vehicle.create({
      data: { vehicleNumber, driver, fuelType },
    });

    return res.status(201).json({ message: "Vehicle added", vehicle });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to add vehicle" });
  }
};

const getVehicles = async (req, res) => {
  try {
    const { status } = req.query;

    const vehicles = await prisma.vehicle.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ vehicles });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch vehicles" });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const vehicle = await prisma.vehicle.update({ where: { id }, data: req.body });

    return res.status(200).json({ message: "Vehicle updated", vehicle });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update vehicle" });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    await prisma.vehicle.delete({ where: { id } });

    return res.status(200).json({ message: "Vehicle deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to delete vehicle" });
  }
};

module.exports = { createVehicle, getVehicles, updateVehicle, deleteVehicle };