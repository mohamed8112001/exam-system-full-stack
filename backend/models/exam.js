const { Schema, model } = require("mongoose");

const ExamSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      trim: true,
    },
    duration_minutes: {
      type: Number,
      required: true,
      min: 1,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [
      {
        question_text: {
          type: String,
          required: true,
          trim: true,
        },
        question_type: {
          type: String,
          required: true,
          enum: ["multiple_choice", "text"],
        },
        points: {
          type: Number,
          required: true,
          min: 0,
        },
        options: [
          {
            option_text: {
              type: String,
              required: true,
            },
            is_correct: {
              type: Boolean,
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = {
  Exam: model("Exam", ExamSchema),
};
