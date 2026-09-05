const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {
  getScholarships,
  getScholarshipById,
  createScholarship,
  updateScholarship,
  deleteScholarship,
  getFilterOptions,
} = require('../controllers/scholarshipController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Optional authentication middleware to attach req.user if token is present
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'scholarship_ai_secret_key_super_secure_2026'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Continue without user
    }
  }
  next();
};

router.get('/meta/filters', getFilterOptions);

router
  .route('/')
  .get(optionalAuth, getScholarships)
  .post(protect, authorize('admin'), createScholarship);

router
  .route('/:id')
  .get(optionalAuth, getScholarshipById)
  .put(protect, authorize('admin'), updateScholarship)
  .delete(protect, authorize('admin'), deleteScholarship);

module.exports = router;
