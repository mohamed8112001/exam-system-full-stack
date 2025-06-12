const examService = require('../services/examService');
const { AppError } = require('../utils/errors');

exports.createExam = async (req, res, next) => {
  try {
    const exam = await examService.createExam(req.body, req.user.user_id);
    res.status(201).json({
      success: true,
      message: "Exam created successfully",
      data: exam
    });
  } catch (error) {
    next(error);
  }
};

exports.updateExam = async (req, res, next) => {
  try {
    const exam = await examService.updateExam(req.params.id, req.body, req.user.user_id);
    res.status(200).json({
      success: true,
      message: "Exam updated successfully",
      data: exam
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteExam = async (req, res, next) => {
  try {
    const result = await examService.deleteExam(req.params.id, req.user.user_id, req.user.role);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};

exports.getExams = async (req, res, next) => {
  try {
    const { page, limit, sortBy, sortOrder, title } = req.query;
    const filters = {};
    if (title) filters.title = title;

    const pagination = { page, limit, sortBy, sortOrder };
    const result = await examService.getExams(filters, pagination);

    res.status(200).json({
      success: true,
      message: "Exams retrieved successfully",
      data: result.exams,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getExamById = async (req, res, next) => {
  try {
    const exam = await examService.getExamById(req.params.id, req.user.role, req.user.user_id);
    res.status(200).json({
      success: true,
      message: "Exam retrieved successfully",
      data: exam
    });
  } catch (error) {
    next(error);
  }
};

exports.getExamStatistics = async (req, res, next) => {
  try {
    const statistics = await examService.getExamStatistics(req.params.id, req.user.user_id, req.user.role);
    res.status(200).json({
      success: true,
      message: "Exam statistics retrieved successfully",
      data: statistics
    });
  } catch (error) {
    next(error);
  }
};
