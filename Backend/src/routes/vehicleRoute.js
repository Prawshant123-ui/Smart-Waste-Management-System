const express = require("express");
const router = express.Router();

const {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/rbacMiddleware");

router.use(protect, authorize("ADMIN"));

router.post("/", createVehicle);
router.get("/", getVehicles);
router.patch("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;