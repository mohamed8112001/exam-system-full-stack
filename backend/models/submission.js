const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

const SubmissionSchema = new Schema({
  exam_id: {
    type: Schema.Types.ObjectId,
    ref: "Exam",
    required: true,
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  answers: [
    {
      question_id: {
        type: Schema.Types.ObjectId,
        required: true,
      },
      selected_option: {
        type: String, // For multiple_choice
      },
      text_answer: {
        type: String, // For text questions
      },
    },
  ],
  score: {
    type: Number,
    default: 0,
  },
  submitted_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = {
  Submission: mongoose.model("Submission", SubmissionSchema),
};
