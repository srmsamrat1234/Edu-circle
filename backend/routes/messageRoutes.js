const express = require('express');
const router = express.Router();
const {
  getConversation,
  sendMessage,
  getUnreadCount
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// All routes are protected
router.use(protect);

// Get conversation with a user
// GET /api/messages/:userId
router.get('/:userId', getConversation);

// Send message (text or PDF file)
// POST /api/messages
// Body: { receiverId, message } OR FormData with file
router.post('/', upload.single('file'), sendMessage);

// Get unread message count
// GET /api/messages/unread/count
router.get('/unread/count', getUnreadCount);

module.exports = router;