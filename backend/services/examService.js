const { Exam } = require('../models/exam');
const { Submission } = require('../models/submission');
const examRepository = require('../repositories/examRepository');
const { ValidationError, NotFoundError, ForbiddenError } = require('../utils/errors');

class ExamService {
  async createExam(examData, userId) {
    try {
      const exam = await examRepository.create({
        ...examData,
        created_by: userId
      });
      return exam;
    } catch (error) {
      throw new ValidationError('Failed to create exam: ' + error.message);
    }
  }

  async getExams(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
      const skip = (page - 1) * limit;

      const query = {};
      if (filters.created_by) query.created_by = filters.created_by;
      if (filters.title) query.title = { $regex: filters.title, $options: 'i' };

      const exams = await examRepository.findWithPagination(query, {
        skip,
        limit: parseInt(limit),
        sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 }
      });

      const total = await examRepository.count(query);

      return {
        exams,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new ValidationError('Failed to fetch exams: ' + error.message);
    }
  }

  async getExamById(examId, userRole, userId) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) {
        throw new NotFoundError('Exam not found');
      }

      // For students, hide correct answers
      if (userRole === 'student') {
        exam.questions = exam.questions.map(question => ({
          ...question.toObject(),
          options: question.options.map(option => ({
            _id: option._id,
            option_text: option.option_text
            // Hide is_correct for students
          }))
        }));
      }

      return exam;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new ValidationError('Failed to fetch exam: ' + error.message);
    }
  }

  async updateExam(examId, updateData, userId) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) {
        throw new NotFoundError('Exam not found');
      }

      if (exam.created_by.toString() !== userId) {
        throw new ForbiddenError('You can only update your own exams');
      }

      const updatedExam = await examRepository.update(examId, updateData);
      return updatedExam;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw new ValidationError('Failed to update exam: ' + error.message);
    }
  }

  async deleteExam(examId, userId, userRole) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) {
        throw new NotFoundError('Exam not found');
      }



      // Allow admins to delete any exam, or users to delete their own exams
      if (userRole !== 'admin' && exam.created_by.toString() !== userId) {
        throw new ForbiddenError('You can only delete your own exams');
      }

      // Check if exam has submissions
      const submissionCount = await Submission.countDocuments({ exam_id: examId });
      if (submissionCount > 0) {
        throw new ForbiddenError('Cannot delete exam with existing submissions');
      }

      await examRepository.delete(examId);
      return { message: 'Exam deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw new ValidationError('Failed to delete exam: ' + error.message);
    }
  }

  async getExamStatistics(examId, userId, userRole) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) {
        throw new NotFoundError('Exam not found');
      }



      // Allow admins to view statistics for any exam, or users to view their own exams
      if (userRole !== 'admin' && exam.created_by.toString() !== userId) {
        throw new ForbiddenError('You can only view statistics for your own exams');
      }

      const submissions = await Submission.find({ exam_id: examId })
        .populate('student_id', 'username email')
        .sort({ submitted_at: -1 });

      const totalSubmissions = submissions.length;
      const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

      const scores = submissions.map(s => s.score);
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
      const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

      return {
        exam: {
          title: exam.title,
          total_points: totalPoints,
          questions_count: exam.questions.length
        },
        statistics: {
          total_submissions: totalSubmissions,
          average_score: Math.round(averageScore * 100) / 100,
          highest_score: highestScore,
          lowest_score: lowestScore,
          average_percentage: totalPoints > 0 ? Math.round((averageScore / totalPoints) * 100) : 0
        },
        submissions: submissions.map(s => ({
          student: s.student_id,
          score: s.score,
          percentage: totalPoints > 0 ? Math.round((s.score / totalPoints) * 100) : 0,
          submitted_at: s.submitted_at
        }))
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw new ValidationError('Failed to get exam statistics: ' + error.message);
    }
  }
}

module.exports = new ExamService();
