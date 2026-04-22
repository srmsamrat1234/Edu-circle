const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// ============ MIDDLEWARE ============
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============ SERVE UPLOADED FILES STATICALLY ============
// This is CRITICAL for PDF/Image downloads to work
const uploadsPath = path.join(__dirname, 'uploads');
const messagesPath = path.join(uploadsPath, 'messages');

// Ensure uploads directories exist
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
  console.log(`📁 Created uploads directory: ${uploadsPath}`);
}
if (!fs.existsSync(messagesPath)) {
  fs.mkdirSync(messagesPath, { recursive: true });
  console.log(`📁 Created messages directory: ${messagesPath}`);
}

// Serve uploaded files at /uploads (primary route)
app.use('/uploads', express.static(uploadsPath));

// ALSO serve at /api/uploads for frontend compatibility 
// (in case API base URL is prepended to file paths)
app.use('/api/uploads', express.static(uploadsPath));

// Debug: Log file access attempts (development only)
if (process.env.NODE_ENV === 'development') {
  app.use('/uploads', (req, res, next) => {
    console.log(`📄 File request: ${req.originalUrl}`);
    next();
  });
}

// ============ API ROUTES ============
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tutors', require('./routes/tutorRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/meetings', require('./routes/meetingRoutes')); // ← ADDED: Meeting routes for Jitsi

// ============ BASIC ROUTES ============

// Root API test
app.get('/api', (req, res) => {
  res.json({ 
    success: true, 
    message: '✅ Educircle API is running!',
    version: '1.0.0'
  });
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find({});
    res.json({ 
      success: true,
      message: 'Database connected!', 
      userCount: users.length 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Database error', 
      error: error.message 
    });
  }
});

// Test file serving (for debugging PDF downloads)
app.get('/api/test-file-serving', (req, res) => {
  res.json({
    success: true,
    message: 'File serving is configured',
    uploadsPath: uploadsPath,
    messagesPath: messagesPath,
    testUrls: {
      direct: `http://localhost:${PORT}/uploads/messages/`,
      viaApi: `http://localhost:${PORT}/api/uploads/messages/`
    },
    note: 'Both URLs should work for accessing uploaded files'
  });
});

// ============ ERROR HANDLING ============

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found` 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ============ START SERVER ============
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Uploads served at: http://localhost:${PORT}/uploads`);
  console.log(` Also available at: http://localhost:${PORT}/api/uploads`);
  console.log(` Messages folder: ${messagesPath}`);
  console.log(` Meetings API: http://localhost:${PORT}/api/meetings`);
});