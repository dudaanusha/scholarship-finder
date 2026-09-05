const Scholarship = require('../models/Scholarship');
const StudentProfile = require('../models/StudentProfile');
const { calculateCompatibility } = require('../services/recommendationEngine');

// @desc    Get all scholarships with filtering, search, sorting & pagination
// @route   GET /api/scholarships
// @access  Public (Optionally authenticated)
exports.getScholarships = async (req, res, next) => {
  try {
    const {
      search,
      state,
      category,
      course,
      type,
      minAmount,
      maxAmount,
      sort = '-createdAt',
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Search query across name, provider, description
    if (search && search.trim() !== '') {
      query.$or = [
        { scholarshipName: { $regex: search.trim(), $options: 'i' } },
        { providerOrganization: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // State filter
    if (state && state !== 'All') {
      query.$or = [
        ...(query.$or || []),
        { applicableStates: { $in: [state, 'All India', 'All'] } },
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.applicableCategories = { $in: [category, 'All'] };
    }

    // Course filter
    if (course && course !== 'All') {
      query.eligibleCourses = { $in: [new RegExp(course, 'i'), 'All Courses', 'All'] };
    }

    // Type filter
    if (type && type !== 'All') {
      query.scholarshipType = type;
    }

    // Amount range
    if (minAmount || maxAmount) {
      query.scholarshipAmount = {};
      if (minAmount) query.scholarshipAmount.$gte = Number(minAmount);
      if (maxAmount) query.scholarshipAmount.$lte = Number(maxAmount);
    }

    // Sort parsing
    let sortOption = {};
    if (sort === 'amount_asc') sortOption = { scholarshipAmount: 1 };
    else if (sort === 'amount_desc') sortOption = { scholarshipAmount: -1 };
    else if (sort === 'deadline_asc') sortOption = { deadline: 1 };
    else if (sort === 'deadline_desc') sortOption = { deadline: -1 };
    else if (sort === 'cgpa_asc') sortOption = { minimumCGPA: 1 };
    else sortOption = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Scholarship.countDocuments(query);
    let scholarships = await Scholarship.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // If user is authenticated as student, attach recommendation scores
    let studentProfile = null;
    if (req.user && req.user.role === 'student') {
      studentProfile = await StudentProfile.findOne({ userId: req.user._id });
    }

    const data = scholarships.map((sch) => {
      const schObj = sch.toObject();
      if (studentProfile) {
        schObj.compatibility = calculateCompatibility(studentProfile, schObj);
      }
      return schObj;
    });

    res.status(200).json({
      success: true,
      count: data.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single scholarship by ID
// @route   GET /api/scholarships/:id
// @access  Public
exports.getScholarshipById = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    // Increment views
    scholarship.viewsCount += 1;
    await scholarship.save();

    const schObj = scholarship.toObject();

    // Attach student recommendation if authenticated
    if (req.user && req.user.role === 'student') {
      const studentProfile = await StudentProfile.findOne({ userId: req.user._id });
      if (studentProfile) {
        schObj.compatibility = calculateCompatibility(studentProfile, schObj);
      }
    }

    res.status(200).json({
      success: true,
      data: schObj,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new scholarship
// @route   POST /api/scholarships
// @access  Private (Admin)
exports.createScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Scholarship created successfully',
      data: scholarship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update scholarship
// @route   PUT /api/scholarships/:id
// @access  Private (Admin)
exports.updateScholarship = async (req, res, next) => {
  try {
    let scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    scholarship = await Scholarship.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Scholarship updated successfully',
      data: scholarship,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete scholarship
// @route   DELETE /api/scholarships/:id
// @access  Private (Admin)
exports.deleteScholarship = async (req, res, next) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);

    if (!scholarship) {
      return res.status(404).json({ success: false, message: 'Scholarship not found' });
    }

    await Scholarship.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Scholarship removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories, states, courses available for filters
// @route   GET /api/scholarships/meta/filters
// @access  Public
exports.getFilterOptions = async (req, res, next) => {
  try {
    const states = [
      'All India',
      'Andhra Pradesh',
      'Assam',
      'Bihar',
      'Delhi',
      'Gujarat',
      'Haryana',
      'Karnataka',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Odisha',
      'Punjab',
      'Rajasthan',
      'Tamil Nadu',
      'Telangana',
      'Uttar Pradesh',
      'West Bengal',
    ];

    const categories = ['All', 'General', 'OBC', 'SC', 'ST', 'EWS'];
    const types = ['Merit-based', 'Need-based', 'Government', 'Private', 'Minority', 'Special Category', 'International'];
    const courses = ['All Courses', 'B.Tech', 'B.Sc', 'B.Com', 'MBBS', 'B.Arch', 'M.Tech', 'MBA', 'PhD', 'Diploma'];

    res.status(200).json({
      success: true,
      data: {
        states,
        categories,
        types,
        courses,
      },
    });
  } catch (error) {
    next(error);
  }
};
