const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    // Check if admin exists
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('✅ Admin already exists!');
      console.log('Email:', adminExists.email);
      process.exit(0);
    }

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@educircle.com',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin',
      isVerified: true
    });

    console.log('✅ Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();