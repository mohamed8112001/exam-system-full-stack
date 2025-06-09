const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require('../middleware/authMiddleware');

// Make sure these routes are properly defined
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get('/me', authMiddleware(["student", "admin"]), authController.getCurrentUser);

module.exports = router;
