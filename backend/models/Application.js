const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scholarship',
      required: true,
    },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Under Review', 'Approved', 'Rejected'],
      default: 'Saved',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      default: '',
    },
    trackingNumber: {
      type: String,
      default: () => 'APP-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    },
    uploadedDocuments: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications per user per scholarship
applicationSchema.index({ userId: 1, scholarshipId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
