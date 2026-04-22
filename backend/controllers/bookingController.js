const Booking = require('../models/Booking');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Create booking request
// @route   POST /api/bookings
// @access  Private (Student/Parent)
exports.createBooking = async (req, res) => {
  try {
    const {
      tutorId,
      subject,
      packageType,
      amount,
      duration,
      mode,
      preferredDate,
      preferredTime,
      message
    } = req.body;

    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== 'tutor') {
      return res.status(404).json({ success: false, message: 'Tutor not found' });
    }

    const booking = await Booking.create({
      student: req.user._id,
      tutor: tutorId,
      subject,
      packageType,
      amount,
      duration,
      mode,
      preferredDate,
      preferredTime,
      message
    });

    // Send notification message to tutor
    await Message.create({
      sender: req.user._id,
      receiver: tutorId,
      booking: booking._id,
      message: `New booking request for ${subject} (${packageType}) - ${preferredDate} at ${preferredTime}`
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email phone')
      .populate('tutor', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for student
// @route   GET /api/bookings/my-bookings
// @access  Private (Student/Parent)
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate('tutor', 'name email subjects')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for tutor
// @route   GET /api/bookings/tutor-bookings
// @access  Private (Tutor)
exports.getTutorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tutor: req.user._id })
      .populate('student', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get tutor bookings error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get PENDING bookings for tutor (NEW FUNCTION)
// @route   GET /api/bookings/tutor/pending
// @access  Private (Tutor)
exports.getPendingBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ 
      tutor: req.user._id,
      status: 'pending'
    })
    .populate('student', 'name email phone')
    .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get pending bookings error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept/Reject booking
// @route   PATCH /api/bookings/:id/status
// @access  Private (Tutor)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, tutorResponse } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    if (tutorResponse) booking.tutorResponse = tutorResponse;
    if (status === 'completed') booking.completedAt = new Date();

    await booking.save();

    // Send notification to student
    await Message.create({
      sender: req.user._id,
      receiver: booking.student,
      booking: booking._id,
      message: `Your booking has been ${status}`
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('student', 'name email')
      .populate('tutor', 'name email');

    res.json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/admin
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('student', 'name email')
      .populate('tutor', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: error.message });
  }
};