const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin-only routes
router.post("/", authMiddleware(["admin"]), examController.createExam);
router.put("/:id", authMiddleware(["admin"]), examController.updateExam);
router.delete("/:id", authMiddleware(["admin"]), examController.deleteExam);
router.get("/:id/statistics", authMiddleware(["admin"]), examController.getExamStatistics);

// Shared routes (for students and admins)
router.get("/", authMiddleware(["student", "admin"]), examController.getExams);
router.get("/:id", authMiddleware(["student", "admin"]), examController.getExamById);

module.exports = router;
