const express = require("express");
const router = express.Router();

const { createCollector, listUsers } = require("../controllers/userController");
const { createCollectorValidator } = require("../validators/userValidator");
const validateRequest = require("../validators/validateRequest");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/rbacMiddleware");


router.use(protect, authorize("ADMIN"));

router.post("/collectors", createCollectorValidator, validateRequest, createCollector);
router.get("/", listUsers);

module.exports = router;
