const express = require('express');
const { register, login, getCurrentUser, getUsersCount } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user account.
router.post('/register', register);

// Log in an existing user.
router.post('/login', login);

// Return the details for the authenticated user.
router.get('/me', protect, getCurrentUser);

// Return the total user count for the dashboard.
router.get('/users', protect, getUsersCount);

module.exports = router;
