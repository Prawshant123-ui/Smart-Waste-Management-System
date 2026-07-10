const express = require("express");
const router = express.Router();

const { assignTask, getMyTasks, completeTask,updateTaskStatus } = require("../controllers/collectionController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/rbacMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.use(protect);

router.post("/assign", authorize("ADMIN"), assignTask);
router.get("/mine", authorize("COLLECTOR"), getMyTasks);
router.patch("/:id/complete", authorize("COLLECTOR"), upload.single("photo"), completeTask);
router.patch("/:id/status", authorize("COLLECTOR"), updateTaskStatus);

module.exports = router;