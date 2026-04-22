const Message = require('../models/Message');

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id }
      ]
    })
    .populate('sender', 'name email role')
    .populate('receiver', 'name email role')
    .sort({ createdAt: 1 });

    // Mark messages as read (only messages FROM the other user TO current user)
    await Message.updateMany(
      {
        sender: userId,
        receiver: req.user._id,
        isRead: false
      },
      { isRead: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send message (text or file)
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, fileType, fileName, fileSize } = req.body;

    // Validate receiverId
    if (!receiverId) {
      return res.status(400).json({ success: false, message: 'Receiver ID is required' });
    }

    // Validate that either message or file is provided
    if (!message && !req.file) {
      return res.status(400).json({ success: false, message: 'Message or file is required' });
    }

    let fileUrl = null;
    let finalFileType = 'text';
    let finalFileName = null;
    let finalFileSize = null;
    let finalMessage = message || '';

    // Handle file upload if present
    if (req.file) {
      // FIXED: Use full URL for cross-origin access
      fileUrl = `/uploads/messages/${req.file.filename}`;
      finalFileType = req.file.mimetype === 'application/pdf' ? 'pdf' : 'image';
      finalFileName = req.file.originalname;
      finalFileSize = req.file.size;
      
      // Set default message for file-only messages
      if (!message) {
        finalMessage = finalFileType === 'pdf' ? `📄 ${finalFileName}` : `🖼️ ${finalFileName}`;
      }
    } else if (fileType && fileName) {
      // Handle file metadata if file was uploaded separately (edge case)
      finalFileType = fileType;
      finalFileName = fileName;
      finalFileSize = fileSize ? parseInt(fileSize) : null;
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      message: finalMessage,
      fileType: finalFileType,
      fileUrl,
      fileName: finalFileName,
      fileSize: finalFileSize
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email role')
      .populate('receiver', 'name email role');

    res.status(201).json({
      success: true,
      message: populatedMessage
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get unread count
// @route   GET /api/messages/unread/count
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.json({ success: true, count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};