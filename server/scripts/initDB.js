const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const initDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create initial owner user (you'll need to set this up with actual Clerk user ID)
    const ownerUser = await User.findOneAndUpdate(
      { email: 'owner@uninotes.com' },
      {
        clerkUserId: 'user_owner_account_id', // Replace with actual Clerk user ID
        firstName: 'System',
        lastName: 'Owner',
        role: 'owner',
        isActive: true
      },
      { upsert: true, new: true }
    );

    console.log('Database initialized successfully');
    console.log('Owner user:', ownerUser.email);
    
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
};

initDatabase();