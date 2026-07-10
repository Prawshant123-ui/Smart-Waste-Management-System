const express = require("express");
const router = express.Router();

const { createCollector, listUsers, updateCollector, deleteCollector } = require("../controllers/userController");
const { createCollectorValidator, updateCollectorValidator } = require("../validators/userValidator");
const validateRequest = require("../validators/validateRequest");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/rbacMiddleware");


router.use(protect, authorize("ADMIN"));

router.post("/collectors", createCollectorValidator, validateRequest, createCollector);
router.get("/", listUsers);
router.patch("/collectors/:id", updateCollectorValidator, validateRequest, updateCollector);
router.delete("/collectors/:id", deleteCollector);

module.exports = router;
