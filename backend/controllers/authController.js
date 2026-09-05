const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'scholarship_ai_secret_key_super_secure_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    // Create user
    const userRole = role === 'admin' ? 'admin' : 'student';
    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    // If student, create default student profile
    let profile = null;
    if (userRole === 'student') {
      profile = await StudentProfile.create({
        userId: user._id,
        fullName: user.name,
        email: user.email,
      });
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password' });
    }

    // Find user with password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile & details
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    let profile = null;
    if (user.role === 'student') {
      profile = await StudentProfile.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user,
      profile,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const rawEmail = req.body.email;

    if (!rawEmail || typeof rawEmail !== 'string' || !rawEmail.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your email address',
      });
    }

    const cleanEmail = rawEmail.trim();
    const escapedEmail = cleanEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Robust user lookup: matches lowercase, exact raw string, trimmed string, or case-insensitive regex
    const user = await User.findOne({
      $or: [
        { email: cleanEmail.toLowerCase() },
        { email: cleanEmail },
        { email: rawEmail },
        { email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } },
      ],
    });

    console.log('Forgot password email query:', cleanEmail);
    console.log('User found:', user ? user.email : 'NO USER FOUND');

    // Requirement 21: Do not reveal whether an email address exists in the database
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, password reset instructions will be sent.',
      });
    }

    // Generate cryptographically secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Store hashed token and 15-minute expiration time
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    // Construct reset URL for frontend deployment and local development
    const clientUrl = process.env.CLIENT_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
    const baseClientUrl = clientUrl.replace(/\/+$/, '');
    const resetUrl = `${baseClientUrl}/reset-password/${resetToken}`;

    console.log(`\n========================================`);
    console.log(`🔑 Password reset token for ${user.email}: ${resetToken}`);
    console.log(`🔗 Password Reset URL: ${resetUrl}`);
    console.log(`========================================\n`);

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, password reset instructions will be sent.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @route   POST /api/auth/reset-password/:token
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token || req.body.token;
    const { password, confirmPassword } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is missing',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    // Hash token to compare with database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with valid, unexpired token (checks hashed token, and raw token for backwards compatibility)
    const user = await User.findOne({
      resetPasswordToken: { $in: [hashedToken, token] },
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      });
    }

    // Set new password (bcrypt pre-save hook on User schema will automatically hash it)
    user.password = password;

    // Clear reset token and expiration
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    console.log(`✅ Password successfully reset for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password has been successfully reset. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};