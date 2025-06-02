const express = require('express');
const router = express.Router();
const { register, login, getProfile, logout } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/register', (req, res) => res.render('register', { error: null }));
router.get('/login', (req, res) => res.render('login', { error: null, message: null }));
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router; 