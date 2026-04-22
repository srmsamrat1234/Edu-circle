const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  packageType: {
    type: String,
    enum: ['hourly', 'weekly', 'monthly'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true
  },
  preferredDate: {
    type: Date,
    required: true
  },
  preferredTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    maxlength: 500
  },
  tutorResponse: {
    type: String,
    maxlength: 500
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);