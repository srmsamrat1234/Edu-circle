const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['admin', 'tutor', 'student', 'parent'],
    default: 'student'
  },
  
  // For parents
  childName: {
    type: String
  },
  
  // For tutors - Core fields
  subjects: [{
    type: String
  }],
  hourlyRate: {
    type: Number,
    min: 0
  },
  weeklyRate: {
    type: Number,
    min: 0
  },
  monthlyRate: {
    type: Number,
    min: 0
  },
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  
  // For tutors - NEW: Availability scheduling
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: {
      type: String,
      // Format: "HH:MM" (24-hour format)
    },
    endTime: {
      type: String,
      // Format: "HH:MM" (24-hour format)
    }
  }],
  
  // For tutors - NEW: Qualification
  qualification: {
    type: String,
    trim: true
  },
  
  // For tutors - NEW: Teaching mode
  teachingMode: [{
    type: String,
    enum: ['Online', 'Offline']
  }],
  
  // For tutors - Ratings & Reviews
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  
  // Account status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);