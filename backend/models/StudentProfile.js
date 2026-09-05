const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    mobileNumber: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      default: 'Male',
    },
    dateOfBirth: {
      type: Date,
    },
    state: {
      type: String,
      trim: true,
      default: 'Maharashtra',
    },
    district: {
      type: String,
      trim: true,
    },
    course: {
      type: String,
      trim: true,
      default: 'B.Tech',
    },
    branch: {
      type: String,
      trim: true,
      default: 'Computer Science and Engineering',
    },
    yearOfStudy: {
      type: String,
      trim: true,
      default: '3rd Year',
    },
    collegeName: {
      type: String,
      trim: true,
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    familyIncome: {
      type: Number,
      min: 0,
      default: 250000,
    },
    category: {
      type: String,
      enum: ['General', 'OBC', 'SC', 'ST', 'EWS'],
      default: 'General',
    },
    minorityStatus: {
      type: Boolean,
      default: false,
    },
    disabilityStatus: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate profile completion percentage
studentProfileSchema.virtual('completionPercentage').get(function () {
  const fields = [
    this.fullName,
    this.email,
    this.mobileNumber,
    this.gender,
    this.dateOfBirth,
    this.state,
    this.district,
    this.course,
    this.branch,
    this.yearOfStudy,
    this.collegeName,
    this.cgpa !== undefined && this.cgpa !== null,
    this.familyIncome !== undefined && this.familyIncome !== null,
    this.category,
  ];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
