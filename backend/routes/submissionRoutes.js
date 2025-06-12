const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');

// Admin routes
router.get('/exams/:exam_id/results', authMiddleware(['admin']), submissionController.getExamResults);

// Student routes
router.post('/exams/:exam_id/submit', authMiddleware(['student']), submissionController.submitExam);
router.get('/results', authMiddleware(['student']), submissionController.getStudentResults);

// Shared route 
router.get('/submission/:id', authMiddleware(['student', 'admin']), submissionController.getSubmissionDetails);

module.exports = router;
