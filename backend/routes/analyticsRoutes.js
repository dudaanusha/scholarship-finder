const express = require('express');
const router = express.Router();
const {
  getAdminAnalytics,
  getStudentAnalytics,
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/admin', protect, authorize('admin'), getAdminAnalytics);
router.get('/student', protect, getStudentAnalytics);

module.exports = router;
