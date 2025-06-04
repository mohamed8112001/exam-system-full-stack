const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const authMiddleware = require("../middleware/authMiddleware");
const { getExamQuestions } = require("../controllers/examController");

router.get("/:exam_id/questions", getExamQuestions);

router.post("/", authMiddleware(["admin"]), examController.createExam);
router.get("/", examController.getExams);
router.put("/:exam_id", authMiddleware(["admin"]), examController.updateExam);
router.get("/:exam_id", examController.getExam);
router.delete("/:exam_id", authMiddleware(["admin"]), examController.deleteExam);

module.exports = router;
