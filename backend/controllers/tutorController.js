const User = require('../models/User');

// @desc    Get all tutors with filters
// @route   GET /api/tutors
// @access  Public
exports.getAllTutors = async (req, res) => {
  try {
    const { subject, minPrice, maxPrice, teachingMode, experience } = req.query;

    // Build filter object
    let filter = { 
      role: 'tutor',
      isActive: true
    };

    // Filter by subject
    if (subject) {
      filter.subjects = { $in: [new RegExp(subject, 'i')] };
    }

    // Filter by teaching mode
    if (teachingMode) {
      filter.teachingMode = { $in: [teachingMode] };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.hourlyRate = {};
      if (minPrice) filter.hourlyRate.$gte = Number(minPrice);
      if (maxPrice) filter.hourlyRate.$lte = Number(maxPrice);
    }

    // Filter by experience
    if (experience) {
      filter.experience = { $gte: Number(experience) };
    }

    const tutors = await User.find(filter).select('-password');

    res.json({
      success: true,
      count: tutors.length,
      tutors
    });
  } catch (error) {
    console.error('Get tutors error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single tutor by ID
// @route   GET /api/tutors/:id
// @access  Public
exports.getTutorById = async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id).select('-password');

    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ 
        success: false,
        message: 'Tutor not found' 
      });
    }

    res.json({
      success: true,
      tutor
    });
  } catch (error) {
    console.error('Get tutor by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tutor profile (for logged-in tutor)
// @route   GET /api/tutors/profile
// @access  Private (Tutor only) ← ADDED THIS FUNCTION
exports.getTutorProfile = async (req, res) => {
  try {
    const tutor = await User.findById(req.user._id).select('-password');

    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ 
        success: false,
        message: 'Tutor profile not found' 
      });
    }

    res.json({
      success: true,
      tutor
    });
  } catch (error) {
    console.error('Get tutor profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update tutor profile
// @route   PUT /api/tutors/profile
// @access  Private (Tutor only)
exports.updateTutorProfile = async (req, res) => {
  try {
    const {
      qualification,
      experience,
      bio,
      hourlyRate,
      weeklyRate,
      monthlyRate,
      subjects,
      teachingMode
    } = req.body;

    const tutor = await User.findById(req.user._id);

    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ 
        success: false,
        message: 'Tutor profile not found' 
      });
    }

    // Update fields if provided
    if (qualification) tutor.qualification = qualification;
    if (experience !== undefined) tutor.experience = Number(experience);
    if (bio !== undefined) tutor.bio = bio;
    if (hourlyRate !== undefined) tutor.hourlyRate = Number(hourlyRate);
    if (weeklyRate !== undefined) tutor.weeklyRate = Number(weeklyRate);
    if (monthlyRate !== undefined) tutor.monthlyRate = Number(monthlyRate);
    if (subjects) tutor.subjects = subjects;
    if (teachingMode) tutor.teachingMode = teachingMode;

    await tutor.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      tutor
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add review/rating to tutor
// @route   POST /api/tutors/:id/review
// @access  Private (Student/Parent only)
exports.addReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const tutor = await User.findById(req.params.id);

    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ 
        success: false,
        message: 'Tutor not found' 
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        message: 'Rating must be between 1 and 5' 
      });
    }

    // Calculate new rating
    const newTotalReviews = tutor.totalReviews + 1;
    const newRating = ((tutor.rating * tutor.totalReviews) + rating) / newTotalReviews;

    tutor.rating = Math.round(newRating * 10) / 10; // Round to 1 decimal
    tutor.totalReviews = newTotalReviews;

    await tutor.save();

    res.json({
      success: true,
      tutor
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available subjects
// @route   GET /api/tutors/subjects
// @access  Public
exports.getSubjects = async (req, res) => {
  try {
    const subjects = [
      'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'English', 'Hindi', 'Computer Science', 'History',
      'Geography', 'Economics', 'Accounting', 'Programming',
      'Web Development', 'Data Science', 'Machine Learning',
      'Python', 'Java', 'JavaScript', 'C++', 'SQL'
    ];

    res.json({
      success: true,
      subjects
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tutors by availability
// @route   GET /api/tutors/available
// @access  Public
exports.getAvailableTutors = async (req, res) => {
  try {
    const { day, time } = req.query;

    let filter = { 
      role: 'tutor',
      isActive: true
    };

    if (day && time) {
      filter.availability = {
        $elemMatch: {
          day: day,
          startTime: { $lte: time },
          endTime: { $gte: time }
        }
      };
    }

    const tutors = await User.find(filter).select('-password');

    res.json({
      success: true,
      count: tutors.length,
      tutors
    });
  } catch (error) {
    console.error('Get available tutors error:', error);
    res.status(500).json({ message: error.message });
  }
};