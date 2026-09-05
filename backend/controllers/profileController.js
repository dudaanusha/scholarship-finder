const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');

// @desc    Get student profile
// @route   GET /api/profile
// @access  Private (Student)
exports.getProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await StudentProfile.create({
        userId: req.user._id,
        fullName: req.user.name,
        email: req.user.email,
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student profile
// @route   PUT /api/profile
// @access  Private (Student)
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      mobileNumber,
      gender,
      dateOfBirth,
      state,
      district,
      course,
      branch,
      yearOfStudy,
      collegeName,
      cgpa,
      familyIncome,
      category,
      minorityStatus,
      disabilityStatus,
    } = req.body;

    let profile = await StudentProfile.findOne({ userId: req.user._id });

    const profileFields = {
      fullName: fullName !== undefined ? fullName : req.user.name,
      email: req.user.email,
      mobileNumber,
      gender,
      dateOfBirth,
      state,
      district,
      course,
      branch,
      yearOfStudy,
      collegeName,
      cgpa: cgpa !== undefined ? Number(cgpa) : undefined,
      familyIncome: familyIncome !== undefined ? Number(familyIncome) : undefined,
      category,
      minorityStatus: Boolean(minorityStatus),
      disabilityStatus: Boolean(disabilityStatus),
    };

    // Filter out undefined fields
    Object.keys(profileFields).forEach(
      (key) => profileFields[key] === undefined && delete profileFields[key]
    );

    if (profile) {
      profile = await StudentProfile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileFields },
        { new: true, runValidators: true }
      );
    } else {
      profile = await StudentProfile.create({
        userId: req.user._id,
        ...profileFields,
      });
    }

    // Also update User name if changed
    if (fullName && fullName !== req.user.name) {
      await User.findByIdAndUpdate(req.user._id, { name: fullName });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};
