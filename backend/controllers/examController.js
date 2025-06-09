const { Exam } = require("../models/exam");

exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, created_by: req.user.user_id });
    res.status(201).json({ message: "Exam created successfully", data: exam });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam updated successfully", data: exam });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json({ message: "Exams retrieved successfully", data: exams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ message: "Exam retrieved successfully", data: exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitExam = async (req, res) => {
  try {
    const { answers } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    let score = 0;
    exam.questions.forEach((question, index) => {
      const correctAnswer = question.answers.find((answer) => answer.is_correct);
      if (correctAnswer && correctAnswer.answer_text === answers[index]) {
        score += question.points;
      }
    });

    res.status(200).json({ message: "Exam submitted successfully", score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
