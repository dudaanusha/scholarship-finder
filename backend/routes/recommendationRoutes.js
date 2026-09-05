const express = require('express');
const router = express.Router();
const { getRecommendations, simulateRecommendation } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecommendations);
router.post('/simulate', simulateRecommendation);

module.exports = router;
