const express = require('express');
const router = express.Router();
const { generateToken, createMeetingRoom } = require('../controllers/meetingController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Generate JWT token for joining meeting
router.post('/generate-token', generateToken);

// Create meeting room for a booking
router.post('/create-room', createMeetingRoom);

module.exports = router;