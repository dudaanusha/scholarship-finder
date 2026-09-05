const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');
const Notification = require('../models/Notification');

// @desc    Toggle Save/Bookmark a scholarship
// @route   POST /api/applications/save/:scholarshipId
// @access  Private (Student)
exports.toggleSaveScholarship = async (req, res, next) => {
  try {
    const { scholarshipId } = req.params;

    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    let application = await Application.findOne({
      userId: req.user._id,
      scholarshipId,
    });

    if (application) {
      if (application.status === 'Saved') {
        // If already saved, remove save bookmark
        await Application.findByIdAndDelete(application._id);
        return res.status(200).json({
          success: true,
          saved: false,
          message: 'Scholarship removed from saved list',
        });
      } else {
        return res.status(400).json({
          success: false,
          message: `Scholarship is already in status: ${application.status}`,
        });
      }
    }

    // Create new saved entry
    application = await Application.create({
      userId: req.user._id,
      scholarshipId,
      status: 'Saved',
    });

    res.status(201).json({
      success: true,
      saved: true,
      message: 'Scholarship saved to your watchlist',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to scholarship or record application
// @route   POST /api/applications/apply/:scholarshipId
// @access  Private (Student)
exports.applyScholarship = async (req, res, next) => {
  try {
    const { scholarshipId } = req.params;
    const { notes } = req.body;

    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    let application = await Application.findOne({
      userId: req.user._id,
      scholarshipId,
    });

    if (application && application.status !== 'Saved') {
      return res.status(400).json({
        success: false,
        message: `You have already applied for this scholarship (Status: ${application.status})`,
      });
    }

    if (application && application.status === 'Saved') {
      application.status = 'Applied';
      application.appliedDate = new Date();
      application.notes = notes || application.notes;
      await application.save();
    } else {
      application = await Application.create({
        userId: req.user._id,
        scholarshipId,
        status: 'Applied',
        appliedDate: new Date(),
        notes: notes || '',
      });
    }

    // Increment applications count on scholarship
    scholarship.applicationsCount += 1;
    await scholarship.save();

    // Create confirmation notification
    await Notification.create({
      userId: req.user._id,
      scholarshipId: scholarship._id,
      title: 'Application Submitted',
      message: `Your application for "${scholarship.scholarshipName}" has been successfully submitted and recorded. Tracking ID: ${application.trackingNumber}`,
      type: 'APPLICATION_UPDATE',
      deadline: scholarship.deadline,
    });

    res.status(200).json({
      success: true,
      message: 'Application recorded successfully! You can track its progress in your Application Tracker.',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for current student
// @route   GET /api/applications
// @access  Private (Student)
exports.getUserApplications = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { userId: req.user._id };

    if (status && status !== 'All') {
      query.status = status;
    }

    const applications = await Application.find(query)
      .populate({
        path: 'scholarshipId',
        select: 'scholarshipName providerOrganization scholarshipAmount deadline applicationLink scholarshipType requiredDocuments minimumCGPA maximumFamilyIncome',
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Admin or notes by Student)
// @route   PUT /api/applications/:id/status
// @access  Private
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id).populate('scholarshipId');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Role check: Only admin can change approval status
    if (status && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can update the review status of applications',
      });
    }

    if (status) {
      application.status = status;
      // Send notification to student about status change
      await Notification.create({
        userId: application.userId,
        scholarshipId: application.scholarshipId._id,
        title: `Application Status: ${status}`,
        message: `Your application for "${application.scholarshipId.scholarshipName}" status has been updated to "${status}".`,
        type: 'APPLICATION_UPDATE',
        deadline: application.scholarshipId.deadline,
      });
    }

    if (notes !== undefined) {
      application.notes = notes;
    }

    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications (Admin)
// @route   GET /api/applications/admin/all
// @access  Private (Admin)
exports.getAllApplicationsAdmin = async (req, res, next) => {
  try {
    const { status, scholarshipId } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }
    if (scholarshipId) {
      query.scholarshipId = scholarshipId;
    }

    const applications = await Application.find(query)
      .populate('userId', 'name email role')
      .populate('scholarshipId', 'scholarshipName providerOrganization scholarshipAmount deadline')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};
