const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Receiver is required']
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  message: {
    type: String,
    maxlength: 1000,
    default: ''
  },
  // File attachment fields (for PDF support)
  fileType: {
    type: String,
    enum: ['text', 'pdf', 'image', 'document'],
    default: 'text'
  },
  fileUrl: {
    type: String,
    default: null
  },
  fileName: {
    type: String,
    default: null
  },
  fileSize: {
    type: Number,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster conversation queries
messageSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);