const submissionService = require('../services/submissionService');

exports.submitExam = async (req, res, next) => {
  try {
    const { exam_id } = req.params;
    const { answers } = req.body;

    const result = await submissionService.submitExam(exam_id, req.user.user_id, answers);

    res.status(201).json({
      success: true,
      message: "Exam submitted successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getStudentResults = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pagination = { page, limit };

    const result = await submissionService.getStudentResults(req.user.user_id, pagination);

    res.status(200).json({
      success: true,
      message: "Student results retrieved successfully",
      data: result.results,
      pagination: result.pagination
    });
  } catch (error) {
    next(error);
  }
};

exports.getExamResults = async (req, res, next) => {
  try {
    const { exam_id } = req.params;
    const { page, limit } = req.query;
    const pagination = { page, limit };

    const result = await submissionService.getExamResults(exam_id, req.user.user_id, pagination);

    res.status(200).json({
      success: true,
      message: "Exam results retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getSubmissionDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await submissionService.getSubmissionDetails(id, req.user.user_id, req.user.role);

    res.status(200).json({
      success: true,
      message: "Submission details retrieved successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};
