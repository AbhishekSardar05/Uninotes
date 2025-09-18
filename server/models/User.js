const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Clerk user data
  
  clerkUserId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'student',
    enum: ['student', 'admin', 'owner']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Admin-specific fields
  isAdmin: {
    type: Boolean,
    default: false
  },
  adminUsername: {
    type: String,
    unique: true,
    sparse: true
  },
  adminPassword: {
    type: String,
    select: false // Don't include in queries by default
  }
}, {
  timestamps: true
});

// Method to compare admin password
UserSchema.methods.compareAdminPassword = async function(password) {
  if (!this.adminPassword) return false;
  return await bcrypt.compare(password, this.adminPassword);
};

// Hash admin password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or is new)
  if (!this.isModified('adminPassword')) return next();
  
  try {
    if (this.adminPassword) {
      const salt = await bcrypt.genSalt(10);
      this.adminPassword = await bcrypt.hash(this.adminPassword, salt);
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);