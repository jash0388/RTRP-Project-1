const express = require('express');
const router = express.Router();
const { register, login, getMe, googleLogin, changePassword, firebaseLogin, supabaseLogin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/firebase-login', firebaseLogin);
router.post('/supabase-login', supabaseLogin);
router.get('/me', protect, getMe);
router.put('/password', protect, changePassword);

module.exports = router;
