const express = require("express");
const router = express.Router();

const {
  createBin,
  getBins,
  getBinById,
  updateBin,
  deleteBin,
} = require("../controllers/binController");
const { createBinValidator, updateBinValidator } = require("../validators/binValidator");
const validateRequest = require("../validators/validateRequest");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/rbacMiddleware");

router.use(protect);

router.get("/", getBins);
router.get("/:id", getBinById);

router.post("/", authorize("ADMIN"), createBinValidator, validateRequest, createBin);
router.patch("/:id", authorize("ADMIN"), updateBinValidator, validateRequest, updateBin);
router.delete("/:id", authorize("ADMIN"), deleteBin);

module.exports = router;