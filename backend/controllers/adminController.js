const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalUsers: count
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new tutor (Admin only)
// @route   POST /api/admin/tutors
// @access  Private/Admin
exports.addTutor = async (req, res) => {
  try {
    const { name, email, phone, password, subjects, qualification, hourlyRate, experience } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const tutor = await User.create({
      name,
      email,
      phone,
      password,
      role: 'tutor',
      subjects: subjects || [],
      qualification,
      hourlyRate,
      experience: experience || 0,
      isVerified: true
    });

    res.status(201).json({
      success: true,
      message: 'Tutor added successfully',
      tutor
    });
  } catch (error) {
    console.error('Add tutor error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify tutor
// @route   PATCH /api/admin/tutors/:id/verify
// @access  Private/Admin
exports.verifyTutor = async (req, res) => {
  try {
    const tutor = await User.findById(req.params.id);

    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }

    tutor.isVerified = req.body.isVerified !== undefined ? req.body.isVerified : true;
    await tutor.save();

    res.json({
      success: true,
      message: `Tutor ${tutor.isVerified ? 'verified' : 'unverified'} successfully`,
      tutor
    });
  } catch (error) {
    console.error('Verify tutor error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTutors = await User.countDocuments({ role: 'tutor' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalParents = await User.countDocuments({ role: 'parent' });
    const verifiedTutors = await User.countDocuments({ role: 'tutor', isVerified: true });
    const pendingTutors = await User.countDocuments({ role: 'tutor', isVerified: false });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalTutors,
        totalStudents,
        totalParents,
        verifiedTutors,
        pendingTutors
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: error.message });
  }
};