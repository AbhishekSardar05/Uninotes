const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const User = require('../models/User');
const Note = require('../models/Note');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, 'note-' + uniqueSuffix + '-' + safeName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt|ppt|pptx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only document files are allowed (PDF, DOC, DOCX, TXT, PPT, PPTX)'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: fileFilter
});

/**
 * 🔑 Predefined admin accounts
 */
const PREDEFINED_ADMINS = [
  {
    email: 'abhisheksardar127@gmail.com',
    username: 'abhishek05',
    password: 'abhishek@380',
    firstName: 'Abhishek',
    lastName: 'Sardar'
  }
];

/**
 * 🔄 Initialize admin users
 */
const initializeAdmins = async () => {
  try {
    console.log('🔄 Initializing admin users...');

    for (const adminData of PREDEFINED_ADMINS) {
      let existingAdmin = await User.findOne({
        $or: [
          { email: adminData.email },
          { adminUsername: adminData.username }
        ]
      });

      if (!existingAdmin) {
        console.log('📝 Creating new admin user:', adminData.email);

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

        const adminUser = new User({
          email: adminData.email,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          role: 'admin',
          isAdmin: true,
          isActive: true,
          adminUsername: adminData.username,
          adminPassword: hashedPassword
        });

        existingAdmin = await adminUser.save();
        console.log('✅ Admin user created:', adminData.username);
      } else {
        console.log('ℹ️ Admin already exists:', adminData.email);
        
        // Update admin fields if needed
        existingAdmin.role = 'admin';
        existingAdmin.isAdmin = true;
        existingAdmin.isActive = true;
        
        // Update password if it's different
        const isPasswordSame = existingAdmin.adminPassword ? 
          await bcrypt.compare(adminData.password, existingAdmin.adminPassword) : false;
        
        if (!isPasswordSame) {
          const saltRounds = 10;
          existingAdmin.adminPassword = await bcrypt.hash(adminData.password, saltRounds);
        }
        
        await existingAdmin.save();
        console.log('✅ Admin user updated:', adminData.username);
      }
    }
  } catch (error) {
    console.error('❌ Error initializing admin users:', error.message);
  }
};

/**
 * 🔐 Verify admin token middleware
 */
const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Admin token required'
    });
  }

  // For demo purposes, we'll accept any token that starts with 'admin-token-'
  if (token.startsWith('admin-token-')) {
    // Create a mock user object for the admin
    req.user = { 
      _id: 'admin-user-id', 
      role: 'admin',
      isAdmin: true
    };
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid admin token'
    });
  }
};

// Apply admin verification to all routes
router.use(verifyAdminToken);

/**
 * 🔐 Admin login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('🔐 Admin login attempt:', username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const adminUser = await User.findOne({
      adminUsername: username,
      isAdmin: true
    }).select('+adminPassword');

    if (!adminUser) {
      console.log('❌ Admin not found:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, adminUser.adminPassword);
    if (!isPasswordValid) {
      console.log('❌ Invalid password for admin:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    const token = `admin-token-${Date.now()}`;

    console.log('✅ Admin login successful:', adminUser.email);

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: adminUser._id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        username: adminUser.adminUsername
      }
    });
  } catch (error) {
    console.error('❌ Admin login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * 📤 Upload note (Admin only) - FIXED VERSION
 */
router.post('/upload-note', upload.single('file'), async (req, res) => {
  try {
    console.log('📤 Admin note upload request received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { title, description, subject, semester, isPublic } = req.body;

    console.log('📝 Note details:', {
      title,
      subject,
      semester,
      isPublic,
      filename: req.file.originalname
    });

    // Find the first admin user to associate with the note
    const adminUser = await User.findOne({ isAdmin: true });
    
    if (!adminUser) {
      console.log('❌ No admin user found in database');
      
      // Create a fallback admin user if none exists
      const fallbackAdmin = new User({
        email: 'fallback@admin.com',
        firstName: 'Fallback',
        lastName: 'Admin',
        role: 'admin',
        isAdmin: true,
        isActive: true,
        adminUsername: 'fallbackadmin',
        adminPassword: await bcrypt.hash('fallbackpassword', 10)
      });
      
      await fallbackAdmin.save();
      console.log('✅ Created fallback admin user');
      
      // Use the fallback admin for the note
      const note = new Note({
        title: title.trim(),
        description: description.trim(),
        subject: subject.trim(),
        semester: parseInt(semester),
        isPublic: isPublic === 'true',
        uploader: fallbackAdmin._id,
        file: {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size
        }
      });

      await note.save();
      await note.populate('uploader', 'firstName lastName email');
      
      console.log('✅ Note uploaded successfully with fallback admin:', note._id);

      return res.status(201).json({
        success: true,
        message: 'Note uploaded successfully (using fallback admin)',
        note
      });
    }

    // Create new note with the found admin user
    const note = new Note({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      semester: parseInt(semester),
      isPublic: isPublic === 'true',
      uploader: adminUser._id,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        size: req.file.size
      }
    });

    await note.save();
    await note.populate('uploader', 'firstName lastName email');
    
    console.log('✅ Note uploaded successfully:', note._id);

    res.status(201).json({
      success: true,
      message: 'Note uploaded successfully',
      note
    });
  } catch (error) {
    console.error('❌ Error uploading note:', error.message);
    
    // Clean up uploaded file if note creation failed
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error uploading note',
      error: error.message
    });
  }
});

/**
 * 📋 Get all users
 */
router.get('/users', async (req, res) => {
  try {
    console.log('📋 Fetching users...');
    const users = await User.find()
      .select('-adminPassword -password')
      .sort({ createdAt: -1 })
      .maxTimeMS(5000);

    res.json({ success: true, count: users.length, users });
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

/**
 * 📋 Get all notes
 */
router.get('/notes', async (req, res) => {
  try {
    console.log('📋 Fetching notes...');
    const notes = await Note.find()
      .populate('uploader', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .maxTimeMS(5000);

    res.json({ success: true, count: notes.length, notes });
  } catch (error) {
    console.error('❌ Error fetching notes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message
    });
  }
});

/**
 * 📊 Get statistics
 */
router.get('/stats', async (req, res) => {
  try {
    console.log('📊 Fetching stats...');
    const userCount = await User.countDocuments().maxTimeMS(5000);
    const activeUsers = await User.countDocuments({ isActive: true }).maxTimeMS(5000);
    const noteCount = await Note.countDocuments().maxTimeMS(5000);

    const totalDownloads = await Note.aggregate([
      { $group: { _id: null, total: { $sum: '$downloads' } } }
    ]).maxTimeMS(5000);

    const avgDownloads =
      noteCount > 0 ? (totalDownloads[0]?.total || 0) / noteCount : 0;

    res.json({
      success: true,
      userCount,
      activeUsers,
      noteCount,
      totalDownloads: totalDownloads[0]?.total || 0,
      avgDownloads: avgDownloads.toFixed(1)
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message
    });
  }
});

/**
 * 🗑️ Delete user
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id).maxTimeMS(5000);
    if (!result) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting user', error: error.message });
  }
});

/**
 * 🗑️ Delete note
 */
router.delete('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).maxTimeMS(5000);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    // Delete the file
    if (note.file && note.file.path) {
      fs.unlink(note.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting note:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting note', error: error.message });
  }
});

/**
 * ♻️ Reset admins
 */
router.post('/reset', async (req, res) => {
  try {
    await User.deleteMany({ isAdmin: true });
    await initializeAdmins();
    res.json({ success: true, message: 'Admin users reset successfully' });
  } catch (error) {
    console.error('❌ Error resetting admins:', error.message);
    res.status(500).json({ success: false, message: 'Error resetting admins', error: error.message });
  }
});

/**
 * 💓 Health check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Admin routes are working',
    timestamp: new Date().toISOString()
  });
});

// 🔄 Initialize admins when module loads
initializeAdmins();

module.exports = router;