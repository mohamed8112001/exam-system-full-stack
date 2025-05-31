const exam = require("../models/exam");
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

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().populate("created_by", "username");
    res.status(201).json({ message: "successfully", data: exams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const exam = await Exam.findById(exam_id);
    if (!exam) {
      res.status(404).json({
        message: "Exam not found",
      });
    }
    res.status(200).json({ message: "successfully", data: exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const { title, description, duration_minutes } = req.body;
    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return res.status(401).json({ message: "Exam not found" });
    }
    // user.user_id ==> get from token
    if (exam.created_by.toString() !== req.user.user_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // It only updates every field if it is sent on the request, otherwise it leaves the old value.
    exam.title = title || exam.title;
    exam.description = description || exam.description;
    exam.duration_minutes = duration_minutes || exam.duration_minutes;
    exam.updatedAt = Date.now();
    await exam.save();
    res.status(201).json({ message: "Exam updated successfully", data: exam });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    const { exam_id } = req.params;
    const exam = await Exam.findById(exam_id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    if (exam.created_by.toString() !== req.user.user_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await exam.deleteOne();
    res.status(201).json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
