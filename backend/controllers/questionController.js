const { Exam } = require("../models/exam");
const addQuestion = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { question_text, question_type, points, options } = req.body;
    if (!question_text || !question_type || !points) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    if (exam.created_by.toString() !== req.user.user_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    exam.questions.push({ question_text, question_type, points, options });
    res.status(201).json({
      message: "Question added successfully",
      question: exam.questions[exam.questions.length - 1],
    });
    exam.save();
  } catch (error) {
    console.log("Add question error:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = { addQuestion };
