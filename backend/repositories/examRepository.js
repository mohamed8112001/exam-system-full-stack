const { Exam } = require('../models/exam');

class ExamRepository {
  async create(examData) {
    const exam = new Exam(examData);
    return await exam.save();
  }

  async findById(id) {
    return await Exam.findById(id).populate('created_by', 'username email');
  }

  async findWithPagination(query = {}, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    
    return await Exam.find(query)
      .populate('created_by', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  async findAll(query = {}) {
    return await Exam.find(query)
      .populate('created_by', 'username email')
      .sort({ createdAt: -1 });
  }

  async update(id, updateData) {
    return await Exam.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('created_by', 'username email');
  }

  async delete(id) {
    return await Exam.findByIdAndDelete(id);
  }

  async count(query = {}) {
    return await Exam.countDocuments(query);
  }

  async findByCreator(creatorId, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    
    return await Exam.find({ created_by: creatorId })
      .populate('created_by', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async search(searchTerm, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;
    
    const query = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    return await Exam.find(query)
      .populate('created_by', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async getExamWithoutAnswers(id) {
    const exam = await Exam.findById(id)
      .populate('created_by', 'username email')
      .lean();

    if (!exam) return null;

    // Remove correct answers for students
    exam.questions = exam.questions.map(question => ({
      ...question,
      options: question.options.map(option => ({
        _id: option._id,
        option_text: option.option_text
        // is_correct is excluded
      }))
    }));

    return exam;
  }
}

module.exports = new ExamRepository();
