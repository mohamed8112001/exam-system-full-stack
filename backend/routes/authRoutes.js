const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected route to get current user
router.get("/me", authMiddleware(["student", "admin"]), authController.getCurrentUser);

module.exports = router;
