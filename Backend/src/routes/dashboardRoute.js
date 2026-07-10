const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getCollectorDashboard,
  getCitizenDashboard,
} = require("../controllers/dashboardController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/rbacMiddleware");

router.use(protect);

router.get("/admin", authorize("ADMIN"), getAdminDashboard);
router.get("/collector", authorize("COLLECTOR"), getCollectorDashboard);
router.get("/citizen", authorize("CITIZEN"), getCitizenDashboard);

module.exports = router;