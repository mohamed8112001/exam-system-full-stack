const { Submission } = require('../models/submission');

class SubmissionRepository {
  async create(submissionData) {
    const submission = new Submission(submissionData);
    return await submission.save();
  }

  async findById(id) {
    return await Submission.findById(id)
      .populate('exam_id', 'title duration_minutes')
      .populate('student_id', 'username email');
  }

  async findByIdWithDetails(id) {
    return await Submission.findById(id)
      .populate({
        path: 'exam_id',
        select: 'title description duration_minutes questions created_by',
        populate: {
          path: 'created_by',
          select: 'username email'
        }
      })
      .populate('student_id', 'username email');
  }

  async findByStudent(studentId, options = {}) {
    const { skip = 0, limit = 10, sort = { submitted_at: -1 } } = options;
    
    return await Submission.find({ student_id: studentId })
      .populate('exam_id', 'title duration_minutes questions')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findByExam(examId, options = {}) {
    const { skip = 0, limit = 10, sort = { submitted_at: -1 } } = options;
    
    return await Submission.find({ exam_id: examId })
      .populate('student_id', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async findByExamAndStudent(examId, studentId) {
    return await Submission.findOne({ 
      exam_id: examId, 
      student_id: studentId 
    });
  }

  async countByStudent(studentId) {
    return await Submission.countDocuments({ student_id: studentId });
  }

  async countByExam(examId) {
    return await Submission.countDocuments({ exam_id: examId });
  }

  async findAll(query = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { submitted_at: -1 } } = options;
    
    return await Submission.find(query)
      .populate('exam_id', 'title duration_minutes')
      .populate('student_id', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getSubmissionStatistics(examId) {
    const submissions = await Submission.find({ exam_id: examId });
    
    if (submissions.length === 0) {
      return {
        total_submissions: 0,
        average_score: 0,
        highest_score: 0,
        lowest_score: 0
      };
    }

    const scores = submissions.map(s => s.score);
    const total = submissions.length;
    const sum = scores.reduce((a, b) => a + b, 0);
    
    return {
      total_submissions: total,
      average_score: Math.round((sum / total) * 100) / 100,
      highest_score: Math.max(...scores),
      lowest_score: Math.min(...scores)
    };
  }

  async getStudentSubmissionHistory(studentId, options = {}) {
    const { skip = 0, limit = 10, sort = { submitted_at: -1 } } = options;
    
    return await Submission.find({ student_id: studentId })
      .populate({
        path: 'exam_id',
        select: 'title duration_minutes questions created_by',
        populate: {
          path: 'created_by',
          select: 'username'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async deleteByExam(examId) {
    return await Submission.deleteMany({ exam_id: examId });
  }

  async updateScore(submissionId, newScore) {
    return await Submission.findByIdAndUpdate(
      submissionId,
      { score: newScore },
      { new: true }
    );
  }
}

module.exports = new SubmissionRepository();
