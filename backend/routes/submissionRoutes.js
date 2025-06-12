const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

// Student routes
router.post('/exams/:exam_id/submit', authMiddleware(['student']), submissionController.submitExam);
router.get('/results', authMiddleware(['student']), submissionController.getStudentResults);

// Admin routes
router.get('/exams/:exam_id/results', authMiddleware(['admin']), submissionController.getExamResults);

// Shared routes (with proper permission checks in controller)
router.get('/:id', authMiddleware(['student', 'admin']), submissionController.getSubmissionDetails);

module.exports = router;