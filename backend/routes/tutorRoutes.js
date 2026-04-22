const express = require('express');
const router = express.Router();
const {
  getAllTutors,
  getTutorById,
  getTutorProfile,
  updateTutorProfile,
  addReview,
  getSubjects,
  getAvailableTutors
} = require('../controllers/tutorController');
const { protect, tutor, student, parent: isParent } = require('../middleware/authMiddleware');

// ============ PUBLIC ROUTES ============

// Get all tutors with filters
// GET /api/tutors?subject=Mathematics&minPrice=300&maxPrice=800&teachingMode=Online
router.get('/', getAllTutors);

// Get available subjects list
// GET /api/tutors/subjects
router.get('/subjects', getSubjects);

// Get single tutor by ID
// GET /api/tutors/64f1a2b3c4d5e6f7g8h9i0j1
router.get('/:id', getTutorById);

// Get tutors by availability
// GET /api/tutors/available?day=Monday&time=18:00
router.get('/available', getAvailableTutors);

// ============ PROTECTED TUTOR ROUTES ============

// Get tutor's own profile
// GET /api/tutors/profile
router.get('/profile', protect, tutor, getTutorProfile);

// Update tutor's own profile
// PUT /api/tutors/profile
// Body: { "subjects": ["Math"], "hourlyRate": 500, "bio": "...", ... }
router.put('/profile', protect, tutor, updateTutorProfile);

// ============ PROTECTED STUDENT/PARENT ROUTES ============

// Add review/rating to tutor (Student or Parent only)
// POST /api/tutors/:id/review
// Body: { "rating": 5, "review": "Great tutor!" }
router.post('/:id/review', protect, (req, res, next) => {
  if (req.user.role === 'student' || req.user.role === 'parent') {
    next();
  } else {
    res.status(403).json({ message: 'Only students or parents can add reviews' });
  }
}, addReview);

// ============ ADMIN ROUTES (Future Enhancement) ============
// router.patch('/:id/verify', protect, admin, verifyTutor);
// router.delete('/:id', protect, admin, deleteTutor);

module.exports = router;