const {Exam} = require("../models/exam");
const {Submission} = require("../models/submission");

const submitExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { answers } = req.body;

    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit exams" });
    }

    let score = 0;
    const processedAnswers = answers.map(answer => {
      const question = exam.questions.id(answer.question_id);
      if (!question) return null;

      if (question.question_type === "multiple_choice") {
        const selected = question.options.find(
          opt => opt.option_text === answer.selected_option
        );
        if (selected?.is_correct) score += question.points;
      }

      return {
        question_id: answer.question_id,
        selected_option: answer.selected_option,
        text_answer: answer.text_answer || null,
      };
    }).filter(Boolean);

    const submission = await Submission.create({
      exam_id,
      student_id: req.user.user_id,
      answers: processedAnswers,
      score,
    });

    res.status(201).json({ message: "Exam submitted successfully", submission });
  } catch (error) {
    console.error("Submit exam error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitExam };
