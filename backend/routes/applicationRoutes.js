const express = require('express');
const router = express.Router();
const {
  toggleSaveScholarship,
  applyScholarship,
  getUserApplications,
  updateApplicationStatus,
  getAllApplicationsAdmin,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getUserApplications);
router.post('/save/:scholarshipId', toggleSaveScholarship);
router.post('/apply/:scholarshipId', applyScholarship);
router.put('/:id/status', updateApplicationStatus);
router.get('/admin/all', authorize('admin'), getAllApplicationsAdmin);

module.exports = router;
