const { Exam } = require("../models/exam");

exports.createExam = async (req, res) => {
  try {
    const { title, description, duration_minutes } = req.body;
    if (!title || !duration_minutes) {
      return res
        .status(400)
        .json({ message: "Title and duration are required" });
    }
    const exam = await Exam.create({
      title,
      description,
      duration_minutes,
      created_by: req.user.user_id,
    });
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    console.log("Create exam error:", error);
    res.status(400).json({ message: error.message });
  }
};
