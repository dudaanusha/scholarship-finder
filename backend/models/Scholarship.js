const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema(
  {
    scholarshipName: {
      type: String,
      required: [true, 'Scholarship name is required'],
      trim: true,
    },
    providerOrganization: {
      type: String,
      required: [true, 'Provider organization is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    eligibilityCriteria: {
      type: String,
      required: true,
    },
    minimumCGPA: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    maximumFamilyIncome: {
      type: Number,
      default: 10000000,
    },
    applicableCategories: {
      type: [String],
      default: ['All'],
    },
    applicableStates: {
      type: [String],
      default: ['All India'],
    },
    eligibleCourses: {
      type: [String],
      default: ['All Courses'],
    },
    scholarshipAmount: {
      type: Number,
      required: [true, 'Scholarship amount is required'],
    },
    amountType: {
      type: String,
      default: 'Per Annum',
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    applicationLink: {
      type: String,
      required: [true, 'Application link is required'],
    },
    scholarshipType: {
      type: String,
      enum: ['Merit-based', 'Need-based', 'Government', 'Private', 'Minority', 'Special Category', 'International'],
      default: 'Merit-based',
    },
    requiredDocuments: {
      type: [String],
      default: ['Previous Marksheets', 'Family Income Certificate', 'Aadhaar Card', 'College Bonafide Certificate'],
    },
    minorityEligibleOnly: {
      type: Boolean,
      default: false,
    },
    disabilityEligibleOnly: {
      type: Boolean,
      default: false,
    },
    genderRequirement: {
      type: String,
      enum: ['All', 'Female', 'Male'],
      default: 'All',
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
scholarshipSchema.index({
  scholarshipName: 'text',
  providerOrganization: 'text',
  description: 'text',
});

module.exports = mongoose.model('Scholarship', scholarshipSchema);
