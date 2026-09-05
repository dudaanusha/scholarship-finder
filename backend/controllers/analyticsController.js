const User = require('../models/User');
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');
const StudentProfile = require('../models/StudentProfile');
const { calculateCompatibility } = require('../services/recommendationEngine');

// @desc    Get comprehensive Admin analytics dashboard metrics
// @route   GET /api/analytics/admin
// @access  Private (Admin)
exports.getAdminAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalScholarships = await Scholarship.countDocuments({ isActive: true });
    const totalApplications = await Application.countDocuments();

    // Application status breakdown
    const applicationsByStatus = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusCounts = {
      Saved: 0,
      Applied: 0,
      'Under Review': 0,
      Approved: 0,
      Rejected: 0,
    };
    applicationsByStatus.forEach((item) => {
      if (statusCounts[item._id] !== undefined) {
        statusCounts[item._id] = item.count;
      }
    });

    // Most Viewed Scholarships (Top 5)
    const mostViewedScholarships = await Scholarship.find({ isActive: true })
      .sort({ viewsCount: -1 })
      .limit(5)
      .select('scholarshipName providerOrganization viewsCount applicationsCount scholarshipAmount');

    // Most Applied Scholarships (Top 5)
    const mostAppliedScholarships = await Scholarship.find({ isActive: true })
      .sort({ applicationsCount: -1 })
      .limit(5)
      .select('scholarshipName providerOrganization applicationsCount viewsCount scholarshipAmount');

    // State-wise student distribution
    const stateDistribution = await StudentProfile.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // Category distribution
    const categoryDistribution = await StudentProfile.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Scholarship Type distribution
    const typeDistribution = await Scholarship.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$scholarshipType', count: { $sum: 1 } } },
    ]);

    // Calculate total disbursement value
    const totalFundsAgg = await Scholarship.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, totalVal: { $sum: '$scholarshipAmount' } } },
    ]);
    const totalFundsAvailable = totalFundsAgg.length > 0 ? totalFundsAgg[0].totalVal : 0;

    res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalUsers,
          totalStudents,
          totalScholarships,
          totalApplications,
          totalFundsAvailable,
          approvalRate:
            statusCounts.Approved + statusCounts.Rejected > 0
              ? Math.round(
                  (statusCounts.Approved /
                    (statusCounts.Approved + statusCounts.Rejected)) *
                    100
                )
              : 0,
        },
        statusCounts,
        mostViewedScholarships,
        mostAppliedScholarships,
        stateDistribution,
        categoryDistribution,
        typeDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Student dashboard summary metrics
// @route   GET /api/analytics/student
// @access  Private (Student)
exports.getStudentAnalytics = async (req, res, next) => {
  try {
    const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
    const allScholarships = await Scholarship.find({ isActive: true });

    // Calculate eligible count
    let eligibleCount = 0;
    let topMatchCount = 0;

    if (studentProfile) {
      allScholarships.forEach((sch) => {
        const comp = calculateCompatibility(studentProfile, sch);
        if (comp.isEligible) eligibleCount++;
        if (comp.priorityRanking === 'Top Match') topMatchCount++;
      });
    }

    const savedCount = await Application.countDocuments({
      userId: req.user._id,
      status: 'Saved',
    });

    const appliedCount = await Application.countDocuments({
      userId: req.user._id,
      status: { $in: ['Applied', 'Under Review', 'Approved', 'Rejected'] },
    });

    // Upcoming deadlines for saved/applied within 14 days
    const now = new Date();
    const fourteenDaysLater = new Date();
    fourteenDaysLater.setDate(now.getDate() + 14);

    const userApps = await Application.find({ userId: req.user._id }).populate('scholarshipId');
    const upcomingDeadlines = userApps
      .filter((app) => {
        if (!app.scholarshipId || !app.scholarshipId.deadline) return false;
        const dl = new Date(app.scholarshipId.deadline);
        return dl >= now && dl <= fourteenDaysLater;
      })
      .map((app) => ({
        applicationId: app._id,
        scholarshipId: app.scholarshipId._id,
        scholarshipName: app.scholarshipId.scholarshipName,
        providerOrganization: app.scholarshipId.providerOrganization,
        deadline: app.scholarshipId.deadline,
        status: app.status,
        scholarshipAmount: app.scholarshipId.scholarshipAmount,
        daysLeft: Math.ceil((new Date(app.scholarshipId.deadline) - now) / (1000 * 60 * 60 * 24)),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);

    res.status(200).json({
      success: true,
      data: {
        totalScholarships: allScholarships.length,
        eligibleCount,
        topMatchCount,
        savedCount,
        appliedCount,
        upcomingDeadlines,
        profileCompletion: studentProfile ? studentProfile.completionPercentage : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
