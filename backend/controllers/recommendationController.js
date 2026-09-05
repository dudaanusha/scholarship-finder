const Scholarship = require('../models/Scholarship');
const StudentProfile = require('../models/StudentProfile');
const { rankScholarships, calculateCompatibility } = require('../services/recommendationEngine');

// @desc    Get AI recommended scholarships ranked for the logged-in student
// @route   GET /api/recommendations
// @access  Private (Student)
exports.getRecommendations = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ userId: req.user._id });

    if (!studentProfile) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your academic profile to receive personalized AI recommendations',
      });
    }

    const scholarships = await Scholarship.find({ isActive: true });
    const ranked = rankScholarships(studentProfile, scholarships);

    // Compute summary metrics
    const topMatches = ranked.filter((s) => s.compatibility.priorityRanking === 'Top Match');
    const highMatches = ranked.filter((s) => s.compatibility.priorityRanking === 'High Match');
    const eligibleMatches = ranked.filter((s) => s.compatibility.isEligible);

    const averageScore = ranked.length > 0
      ? Math.round(ranked.reduce((acc, curr) => acc + curr.compatibility.recommendationScore, 0) / ranked.length)
      : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalScholarships: ranked.length,
        eligibleCount: eligibleMatches.length,
        topMatchCount: topMatches.length,
        highMatchCount: highMatches.length,
        averageScore,
      },
      data: ranked,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Simulate recommendation score for custom profile inputs (What-If analyzer)
// @route   POST /api/recommendations/simulate
// @access  Public
exports.simulateRecommendation = async (req, res, next) => {
  try {
    const { profile, scholarshipId } = req.body;

    if (!profile) {
      return res.status(400).json({ success: false, message: 'Student profile details are required' });
    }

    if (scholarshipId) {
      const scholarship = await Scholarship.findById(scholarshipId);
      if (!scholarship) {
        return res.status(404).json({ success: false, message: 'Scholarship not found' });
      }
      const compatibility = calculateCompatibility(profile, scholarship);
      return res.status(200).json({
        success: true,
        data: compatibility,
      });
    }

    const scholarships = await Scholarship.find({ isActive: true });
    const ranked = rankScholarships(profile, scholarships);

    res.status(200).json({
      success: true,
      count: ranked.length,
      data: ranked,
    });
  } catch (error) {
    next(error);
  }
};
