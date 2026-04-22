const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
const messagesDir = path.join(uploadsDir, 'messages');

// Ensure directories exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(messagesDir)) {
  fs.mkdirSync(messagesDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, messagesDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp-random-originalExtension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

// File filter for PDFs and images
const fileFilter = (req, file, cb) => {
  // Allowed MIME types (standardized)
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png', 
    'image/gif',
    'image/webp'
  ];
  
  // Also allow .jpg extension (maps to image/jpeg)
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and image files (PDF, JPG, JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

// Upload middleware configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Error handling wrapper for better error messages
upload.any(); // Initialize multer

module.exports = upload;