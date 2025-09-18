const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Predefined admin credentials
const PREDEFINED_ADMINS = [
  {
    email: 'admin@uninotes.com',
    username: 'admin',
    password: 'admin123', // Default password
    firstName: 'System',
    lastName: 'Administrator'
  }
];

// Initialize admin users
const initializeAdmins = async () => {
  try {
    console.log('Initializing admin users...');
    
    for (const adminData of PREDEFINED_ADMINS) {
      const existingAdmin = await User.findOne({ 
        $or: [
          { email: adminData.email },
          { adminUsername: adminData.username }
        ]
      });

      if (!existingAdmin) {
        const adminUser = new User({
          email: adminData.email,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          role: 'admin',
          isAdmin: true,
          adminUsername: adminData.username,
          adminPassword: adminData.password
        });

        await adminUser.save();
        console.log(`✅ Admin user ${adminData.email} created successfully`);
        console.log(`   Username: ${adminData.username}`);
        console.log(`   Password: ${adminData.password}`);
      } else {
        console.log(`ℹ️ Admin user ${adminData.email} already exists`);
      }
    }
  } catch (error) {
    console.error('❌ Error initializing admin users:', error);
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('🔐 Admin login attempt:', { username });

    if (!username || !password) {
      console.log('❌ Missing username or password');
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    // Find admin user (including password field)
    const adminUser = await User.findOne({ 
      adminUsername: username,
      isAdmin: true 
    }).select('+adminPassword');

    if (!adminUser) {
      console.log('❌ Admin user not found:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid admin credentials' 
      });
    }

    console.log('✅ Admin user found:', adminUser.email);

    // Check password
    const isPasswordValid = await adminUser.compareAdminPassword(password);
    console.log('🔑 Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password for admin:', username);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid admin credentials' 
      });
    }

    // Generate admin token
    const token = generateToken(adminUser._id);
    console.log('✅ Admin login successful:', adminUser.email);

    res.status(200).json({
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
    console.error('❌ Admin login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

// Verify admin status
const verifyAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ 
        success: false,
        message: 'Admin access required' 
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin verified',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.adminUsername
      }
    });

  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

module.exports = {
  initializeAdmins,
  adminLogin,
  verifyAdmin
};