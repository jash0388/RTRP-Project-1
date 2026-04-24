const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { verifyFirebaseToken } = require('../config/firebase');

// Password validation helper
const validatePassword = (password) => {
  const errors = [];
  if (!password || password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Must contain at least one uppercase letter (A-Z)');
  if (!/[a-z]/.test(password)) errors.push('Must contain at least one lowercase letter (a-z)');
  if (!/[0-9]/.test(password)) errors.push('Must contain at least one digit (0-9)');
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errors.push('Must contain at least one special character (!@#$%^&*)');
  return errors;
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message: 'Password does not meet security requirements',
        passwordErrors
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    // Handle Sequelize validation errors gracefully
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join('. '), passwordErrors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact the administrator.' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current password and new password' });
    }

    // Validate new password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      return res.status(400).json({
        message: 'New password does not meet security requirements',
        passwordErrors
      });
    }

    const user = await User.scope('withPassword').findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(e => e.message);
      return res.status(400).json({ message: messages.join('. '), passwordErrors: messages });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Google login
// @route   POST /api/auth/google
exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'No Google token provided.' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error('GOOGLE_CLIENT_ID is not set in server .env');
      return res.status(500).json({ 
        message: 'Google Login is not configured on the server.',
        errorCode: 'GOOGLE_NOT_CONFIGURED'
      });
    }

    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });
    } catch (verifyError) {
      console.error('Google token verification failed:', verifyError.message);
      
      let userMessage = 'Google authentication failed. ';
      if (verifyError.message.includes('Token used too late') || verifyError.message.includes('expired')) {
        userMessage += 'The token has expired. Please try again.';
      } else if (verifyError.message.includes('audience')) {
        userMessage += 'Client ID mismatch. Please check Google OAuth configuration.';
      } else if (verifyError.message.includes('Invalid token')) {
        userMessage += 'Invalid token received. Please clear your browser cache and retry.';
      } else {
        userMessage += 'Please ensure your Google account is valid and try again.';
      }

      return res.status(401).json({ 
        message: userMessage,
        errorCode: 'GOOGLE_VERIFY_FAILED',
        detail: verifyError.message
      });
    }
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.scope('withPassword').findOne({ where: { email } });
    
    if (user) {
      // Reject police/admin from logging in with Google
      if (user.role === 'police' || user.role === 'admin') {
        return res.status(403).json({ message: 'Police and Admin accounts must login with credentials.' });
      }
      // Update avatar if changed
      if (picture && user.avatar !== picture) {
        await user.update({ avatar: picture });
      }

      if (user.isBanned) {
        return res.status(403).json({ message: 'Your account has been suspended. Please contact the administrator.' });
      }
    } else {
      // Create new user if not exists
      const randomPassword = 'G' + Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-6).toUpperCase() + '@1';
      user = await User.create({ name, email, password: randomPassword, role: 'user', avatar: picture || '' });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      message: 'Google authentication failed. Please try again later.',
      errorCode: 'GOOGLE_SERVER_ERROR'
    });
  }
};

// @desc    Firebase token login (hybrid auth)
// @route   POST /api/auth/firebase-login
exports.firebaseLogin = async (req, res) => {
  try {
    const { firebaseToken, loginType } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({ message: 'No Firebase token provided.' });
    }

    // Verify Firebase ID token
    let decodedToken;
    try {
      decodedToken = await verifyFirebaseToken(firebaseToken);
    } catch (verifyError) {
      console.error('Firebase token verification failed:', verifyError.message);
      return res.status(401).json({ message: 'Invalid or expired Firebase token. Please try logging in again.' });
    }

    const email = decodedToken.email;
    const name = decodedToken.name || decodedToken.email.split('@')[0];

    if (!email) {
      return res.status(400).json({ message: 'Firebase token does not contain an email address.' });
    }

    // Look up user in backend database
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Auto-create ONLY for citizen login (loginType === 'user' or undefined)
      if (loginType === 'police') {
        return res.status(403).json({ message: 'No police account found for this email. Contact your administrator to register.' });
      }
      if (loginType === 'admin') {
        return res.status(403).json({ message: 'No admin account found for this email. Contact the system administrator.' });
      }

      // Auto-create citizen user in backend DB
      const randomPassword = 'Fb' + Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-6).toUpperCase() + '@1';
      user = await User.create({
        name,
        email,
        password: randomPassword,
        role: 'user'
      });
    }

    // Enforce role checks based on loginType
    if (loginType === 'police' && user.role !== 'police' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. This portal is reserved for Enforcement Personnel.' });
    }
    if (loginType === 'admin' && user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. This portal is restricted to System Administrators.' });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact the administrator.' });
    }

    // Issue backend JWT
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    res.status(500).json({ message: 'Authentication failed. Please try again.', error: error.message });
  }
};

// @desc    Supabase token login (hybrid auth for Admin)
// @route   POST /api/auth/supabase-login
exports.supabaseLogin = async (req, res) => {
  try {
    const { supabaseToken } = req.body;

    if (!supabaseToken) {
      return res.status(400).json({ message: 'No Supabase token provided.' });
    }

    // Verify Supabase JWT token
    let decodedToken;
    try {
      decodedToken = jwt.verify(supabaseToken, process.env.SUPABASE_JWT_SECRET);
    } catch (verifyError) {
      console.error('Supabase token verification failed:', verifyError.message);
      return res.status(401).json({ message: 'Invalid or expired Supabase token.' });
    }

    const email = decodedToken.email;

    if (!email) {
      return res.status(400).json({ message: 'Supabase token does not contain an email address.' });
    }

    // Look up user in backend database
    let user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({ message: 'No admin account found for this email. Contact the system administrator.' });
    }

    // Enforce role check
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. This portal is restricted to System Administrators.' });
    }

    if (user.isBanned) {
      return res.status(403).json({ message: 'Your account has been suspended. Please contact the administrator.' });
    }

    // Issue backend JWT
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Supabase login error:', error);
    res.status(500).json({ message: 'Authentication failed. Please try again.', error: error.message });
  }
};
