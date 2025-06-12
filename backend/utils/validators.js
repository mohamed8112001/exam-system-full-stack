const { body, param, query, validationResult } = require('express-validator');

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('role')
    .isIn(['student', 'admin'])
    .withMessage('Role must be either student or admin'),
  
  handleValidationErrors
];

const loginValidator = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Exam validators
const createExamValidator = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('duration_minutes')
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  
  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),
  
  body('questions.*.question_text')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Question text is required and must be less than 500 characters'),
  
  body('questions.*.question_type')
    .isIn(['multiple_choice', 'text'])
    .withMessage('Question type must be either multiple_choice or text'),
  
  body('questions.*.points')
    .isInt({ min: 1, max: 100 })
    .withMessage('Points must be between 1 and 100'),
  
  body('questions.*.options')
    .if(body('questions.*.question_type').equals('multiple_choice'))
    .isArray({ min: 2, max: 6 })
    .withMessage('Multiple choice questions must have between 2 and 6 options'),
  
  body('questions.*.options.*.option_text')
    .if(body('questions.*.question_type').equals('multiple_choice'))
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Option text is required and must be less than 200 characters'),
  
  body('questions.*.options.*.is_correct')
    .if(body('questions.*.question_type').equals('multiple_choice'))
    .isBoolean()
    .withMessage('is_correct must be a boolean'),
  
  handleValidationErrors
];

const updateExamValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid exam ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be less than 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be less than 500 characters'),
  
  body('duration_minutes')
    .optional()
    .isInt({ min: 1, max: 480 })
    .withMessage('Duration must be between 1 and 480 minutes'),
  
  handleValidationErrors
];

// Submission validators
const submitExamValidator = [
  param('exam_id')
    .isMongoId()
    .withMessage('Invalid exam ID'),
  
  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),
  
  body('answers.*.question_id')
    .isMongoId()
    .withMessage('Invalid question ID'),
  
  body('answers.*.selected_option_id')
    .optional()
    .isMongoId()
    .withMessage('Invalid option ID'),
  
  body('answers.*.text_answer')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Text answer must be less than 1000 characters'),
  
  handleValidationErrors
];

// Pagination validators
const paginationValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['title', 'createdAt', 'duration_minutes', 'submitted_at'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

// ID parameter validator
const mongoIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  
  handleValidationErrors
];

module.exports = {
  registerValidator,
  loginValidator,
  createExamValidator,
  updateExamValidator,
  submitExamValidator,
  paginationValidator,
  mongoIdValidator,
  handleValidationErrors
};
