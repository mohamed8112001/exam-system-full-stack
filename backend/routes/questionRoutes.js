const express = require('express');
const router = express.Router({ mergeParams: true });
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['admin']), questionController.addQuestion);

module.exports = router;