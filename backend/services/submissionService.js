const { Submission } = require('../models/submission');
const { Exam } = require('../models/exam');
const submissionRepository = require('../repositories/submissionRepository');
const examRepository = require('../repositories/examRepository');
const { ValidationError, NotFoundError, ForbiddenError } = require('../utils/errors');

class SubmissionService {
  async submitExam(examId, studentId, answers) {
    try {


      // Check if exam exists
      const exam = await examRepository.findById(examId);
      if (!exam) {
        throw new NotFoundError('Exam not found');
      }

      // Check if student already submitted this exam
      const existingSubmission = await submissionRepository.findByExamAndStudent(examId, studentId);
      if (existingSubmission) {
        throw new ForbiddenError('You have already submitted this exam');
      }

      // Validate answers format
      if (!Array.isArray(answers)) {
        throw new ValidationError('Answers must be an array');
      }

      // Calculate score
      const { score, detailedResults } = this.calculateScore(exam, answers);

      // Create submission
      const submissionData = {
        exam_id: examId,
        student_id: studentId,
        answers: answers.map(answer => ({
          question_id: answer.question_id,
          selected_option: answer.selected_option_id || null,
          text_answer: answer.text_answer || null
        })),
        score
      };

      const submission = await submissionRepository.create(submissionData);

      return {
        submission_id: submission._id,
        score,
        total_points: exam.questions.reduce((sum, q) => sum + q.points, 0),
        percentage: this.calculatePercentage(score, exam.questions),
        detailed_results: detailedResults
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError || error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError('Failed to submit exam: ' + error.message);
    }
  }

  calculateScore(exam, answers) {
    let totalScore = 0;
    const detailedResults = [];

    exam.questions.forEach((question, index) => {
      const studentAnswer = answers.find(a => a.question_id === question._id.toString());
      let isCorrect = false;
      let earnedPoints = 0;

      if (question.question_type === 'multiple_choice') {
        const correctOption = question.options.find(opt => opt.is_correct);
        if (correctOption && studentAnswer && studentAnswer.selected_option_id === correctOption._id.toString()) {
          isCorrect = true;
          earnedPoints = question.points;
          totalScore += question.points;
        }
      } else if (question.question_type === 'text') {
        // For text questions, manual grading would be needed
        // For now, we'll mark as correct if answer is provided
        if (studentAnswer && studentAnswer.text_answer && studentAnswer.text_answer.trim()) {
          isCorrect = true;
          earnedPoints = question.points;
          totalScore += question.points;
        }
      }

      detailedResults.push({
        question_id: question._id,
        question_text: question.question_text,
        question_type: question.question_type,
        points: question.points,
        earned_points: earnedPoints,
        is_correct: isCorrect,
        student_answer: studentAnswer || null
      });
    });

    return { score: totalScore, detailedResults };
  }

  calculatePercentage(score, questions) {
    const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
    return totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
  }

  async getStudentResults(studentId, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const submissions = await submissionRepository.findByStudent(studentId, {
        skip,
        limit: parseInt(limit),
        sort: { submitted_at: -1 }
      });

      const total = await submissionRepository.countByStudent(studentId);

      const results = submissions.map(submission => {
        const totalPoints = submission.exam_id.questions.reduce((sum, q) => sum + q.points, 0);
        return {
          submission_id: submission._id,
          exam: {
            id: submission.exam_id._id,
            title: submission.exam_id.title,
            duration_minutes: submission.exam_id.duration_minutes
          },
          score: submission.score,
          total_points: totalPoints,
          percentage: this.calculatePercentage(submission.score, submission.exam_id.questions),
          submitted_at: submission.submitted_at
        };
      });

      return {
        results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new ValidationError('Failed to fetch student results: ' + error.message);
    }
  }

  async getSubmissionDetails(submissionId, userId, userRole) {
    try {
      const submission = await submissionRepository.findByIdWithDetails(submissionId);
      if (!submission) {
        throw new NotFoundError('Submission not found');
      }

      // Check permissions
      if (userRole === 'student' && submission.student_id._id.toString() !== userId) {
        throw new ForbiddenError('You can only view your own submissions');
      }

      if (userRole === 'admin' && submission.exam_id.created_by.toString() !== userId) {
        throw new ForbiddenError('You can only view submissions for your own exams');
      }

      const totalPoints = submission.exam_id.questions.reduce((sum, q) => sum + q.points, 0);

      return {
        submission_id: submission._id,
        exam: {
          id: submission.exam_id._id,
          title: submission.exam_id.title,
          description: submission.exam_id.description,
          duration_minutes: submission.exam_id.duration_minutes
        },
        student: {
          id: submission.student_id._id,
          username: submission.student_id.username,
          email: submission.student_id.email
        },
        score: submission.score,
        total_points: totalPoints,
        percentage: this.calculatePercentage(submission.score, submission.exam_id.questions),
        submitted_at: submission.submitted_at,
        answers: submission.answers,
        questions: submission.exam_id.questions
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw new ValidationError('Failed to fetch submission details: ' + error.message);
    }
  }

  async getExamResults(examId, userId, pagination = {}) {
    try {
      const exam = await examRepository.findById(examId);
      if (!exam) {
        throw new NotFoundError('Exam not found');
      }

      if (exam.created_by.toString() !== userId) {
        throw new ForbiddenError('You can only view results for your own exams');
      }

      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const submissions = await submissionRepository.findByExam(examId, {
        skip,
        limit: parseInt(limit),
        sort: { submitted_at: -1 }
      });

      const total = await submissionRepository.countByExam(examId);
      const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);

      const results = submissions.map(submission => ({
        submission_id: submission._id,
        student: {
          id: submission.student_id._id,
          username: submission.student_id.username,
          email: submission.student_id.email
        },
        score: submission.score,
        total_points: totalPoints,
        percentage: this.calculatePercentage(submission.score, exam.questions),
        submitted_at: submission.submitted_at
      }));

      return {
        exam: {
          id: exam._id,
          title: exam.title,
          total_points: totalPoints,
          questions_count: exam.questions.length
        },
        results,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) throw error;
      throw new ValidationError('Failed to fetch exam results: ' + error.message);
    }
  }
}

module.exports = new SubmissionService();
