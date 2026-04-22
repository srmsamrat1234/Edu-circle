const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  addTutor,
  verifyTutor,
  deleteUser,
  getStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are protected and admin only
router.use(protect);
router.use(admin);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUser);

// Tutor management
router.post('/tutors', addTutor);
router.patch('/tutors/:id/verify', verifyTutor);

// Dashboard
router.get('/stats', getStats);

module.exports = router;