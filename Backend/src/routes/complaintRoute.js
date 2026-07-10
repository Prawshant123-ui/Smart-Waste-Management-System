const express = require("express");
const router = express.Router();

const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  approveComplaint,
} = require("../controllers/complaintController");
const { createComplaintValidator } = require("../validators/complaintValidator");
const validateRequest = require("../validators/validateRequest");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/rbacMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.use(protect);

router.post(
  "/",
  authorize("CITIZEN"),
  upload.single("image"),
  createComplaintValidator,
  validateRequest,
  createComplaint
);
router.get("/mine", authorize("CITIZEN"), getMyComplaints);
router.patch("/:id", authorize("CITIZEN"), updateComplaint);
router.delete("/:id", authorize("CITIZEN"), deleteComplaint);

router.get("/", authorize("ADMIN"), getAllComplaints);
router.patch("/:id/approve", authorize("ADMIN"), approveComplaint);

router.get("/:id", getComplaintById);

module.exports = router;