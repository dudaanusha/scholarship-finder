const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scholarship',
    },
    title: {
      type: String,
      required: true,
      default: 'Deadline Reminder',
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'DEADLINE_REMINDER_7D',
        'DEADLINE_REMINDER_3D',
        'DEADLINE_REMINDER_1D',
        'APPLICATION_UPDATE',
        'RECOMMENDATION_ALERT',
        'GENERAL',
      ],
      default: 'GENERAL',
    },
    deadline: {
      type: Date,
    },
    readStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
