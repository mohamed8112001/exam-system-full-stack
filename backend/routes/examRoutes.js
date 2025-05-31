const express = require("express");
const router = express.Router();
const examController = require("../controllers/examController");
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware(['admin']), examController.createExam);

// router.post("/", examController.createExam);
// router.post("/login", examController.login);

module.exports = router;



// router.get('/', examController.getExams);
// router.put('/:exam_id', authMiddleware(['admin']), examController.updateExam);
// router.delete('/:exam_id', authMiddleware(['admin']), examController.deleteExam);

// module.exports = router;