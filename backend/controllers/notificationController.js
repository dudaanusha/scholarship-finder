const Notification = require('../models/Notification');
const Application = require('../models/Application');
const Scholarship = require('../models/Scholarship');

// @desc    Get all notifications for logged-in student
// @route   GET /api/notifications
// @access  Private (Student)
exports.getNotifications = async (req, res, next) => {
  try {
    // Run automated deadline reminder check for this user
    await generateRemindersForUser(req.user._id);

    const notifications = await Notification.find({ userId: req.user._id })
      .populate('scholarshipId', 'scholarshipName providerOrganization deadline scholarshipAmount applicationLink')
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      userId: req.user._id,
      readStatus: false,
    });

    res.status(200).json({
      success: true,
      unreadCount,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.readStatus = true;
    await notification.save();

    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, readStatus: false },
      { $set: { readStatus: true } }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper to generate 7-day, 3-day, and 1-day deadline reminders
 */
async function generateRemindersForUser(userId) {
  try {
    const applications = await Application.find({
      userId,
      status: { $in: ['Saved', 'Applied', 'Under Review'] },
    }).populate('scholarshipId');

    const now = new Date();

    for (const app of applications) {
      const scholarship = app.scholarshipId;
      if (!scholarship || !scholarship.deadline) continue;

      const deadline = new Date(scholarship.deadline);
      const diffTime = deadline.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // 7 Days reminder (between 6 and 8 days)
      if (diffDays <= 7 && diffDays > 3) {
        const exists = await Notification.findOne({
          userId,
          scholarshipId: scholarship._id,
          type: 'DEADLINE_REMINDER_7D',
        });
        if (!exists) {
          await Notification.create({
            userId,
            scholarshipId: scholarship._id,
            title: '7 Days to Deadline',
            message: `Reminder: You have approximately 7 days left before the deadline for "${scholarship.scholarshipName}" (${deadline.toLocaleDateString()}). Ensure all documents are uploaded.`,
            type: 'DEADLINE_REMINDER_7D',
            deadline,
          });
        }
      }

      // 3 Days reminder (between 2 and 3 days)
      if (diffDays <= 3 && diffDays > 1) {
        const exists = await Notification.findOne({
          userId,
          scholarshipId: scholarship._id,
          type: 'DEADLINE_REMINDER_3D',
        });
        if (!exists) {
          await Notification.create({
            userId,
            scholarshipId: scholarship._id,
            title: 'Urgent: 3 Days Left',
            message: `Priority Alert: Only 3 days remaining to apply or finalize your application for "${scholarship.scholarshipName}" (${deadline.toLocaleDateString()}).`,
            type: 'DEADLINE_REMINDER_3D',
            deadline,
          });
        }
      }

      // 1 Day reminder (0 to 1 day)
      if (diffDays <= 1 && diffDays >= 0) {
        const exists = await Notification.findOne({
          userId,
          scholarshipId: scholarship._id,
          type: 'DEADLINE_REMINDER_1D',
        });
        if (!exists) {
          await Notification.create({
            userId,
            scholarshipId: scholarship._id,
            title: 'Final Call: Deadline Approaching',
            message: `Action Required: Tomorrow is the deadline for "${scholarship.scholarshipName}" (${deadline.toLocaleDateString()}). Submit now!`,
            type: 'DEADLINE_REMINDER_1D',
            deadline,
          });
        }
      }
    }
  } catch (err) {
    console.error('Error generating deadline reminders:', err.message);
  }
}
