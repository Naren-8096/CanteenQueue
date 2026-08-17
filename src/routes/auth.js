const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, createAdmin, login, getMe, updateMe, forgotPassword, resetPassword, googleCallback } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/admin/create-admin', protect, adminOnly, createAdmin);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login.html' }), googleCallback);

module.exports = router;
