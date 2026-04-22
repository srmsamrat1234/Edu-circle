const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getTutorBookings,
  getPendingBookings,
  updateBookingStatus,
  getAllBookings
} = require('../controllers/bookingController');
const { protect, student, parent, tutor, admin } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Student/Parent routes
router.post('/', student, createBooking);
router.post('/', parent, createBooking);
router.get('/my-bookings', student, getMyBookings);
router.get('/my-bookings', parent, getMyBookings);

// Tutor routes
router.get('/tutor-bookings', tutor, getTutorBookings);
router.get('/tutor/pending', tutor, getPendingBookings);  // ← ADD THIS LINE
router.patch('/:id/status', tutor, updateBookingStatus);

// Admin routes
router.get('/admin', admin, getAllBookings);

module.exports = router;