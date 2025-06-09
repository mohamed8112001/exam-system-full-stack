const {Exam} = require("../models/exam");
const {Submission} = require("../models/submission");

exports.submitExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { answers } = req.body;

    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Validate that user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit exams" });
    }

    // Calculate score
    let score = 0;
    const processedAnswers = answers.map(answer => {
      const question = exam.questions.id(answer.question_id);
      if (!question) return null;

      if (question.question_type === "multiple_choice") {
        const selected = question.options.find(
          opt => opt._id.toString() === answer.selected_option_id
        );
        if (selected?.is_correct) score += question.points;
      }

      return {
        question_id: answer.question_id,
        selected_option: answer.selected_option_id,
        text_answer: answer.text_answer || null,
      };
    }).filter(Boolean);

    // Create submission record
    const submission = await Submission.create({
      exam_id,
      student_id: req.user.user_id,
      answers: processedAnswers,
      score,
    });

    res.status(201).json({
      message: "Exam submitted successfully",
      data: {
        score,
        total_points: exam.questions.reduce((sum, q) => sum + q.points, 0),
        submission_id: submission._id
      }
    });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getStudentResults = async (req, res) => {
  try {
    const submissions = await Submission.find({ 
      student_id: req.user.user_id 
    })
    .populate('exam_id', 'title duration_minutes')
    .sort({ submitted_at: -1 });
    
    res.status(200).json({ data: submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExamResults = async (req, res) => {
  try {
    // Only admins can view all results for an exam
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    const { exam_id } = req.params;
    const submissions = await Submission.find({ exam_id })
      .populate('student_id', 'username email')
      .sort({ score: -1 });
    
    res.status(200).json({ data: submissions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
