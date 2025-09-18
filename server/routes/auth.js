const express = require('express');
const router = express.Router();
const verifyWebhook = require('../middleware/clerkWebhook');
const { 
  handleClerkWebhook, 
  syncUserManual,
  createUserManually, 
  getUserByClerkId 
} = require('../controllers/authController');

// Webhook endpoint for Clerk to sync users
router.post('/webhook', verifyWebhook, handleClerkWebhook);

// Manual user sync endpoint for development
router.post('/sync-user', syncUserManual);

// Development endpoints
router.post('/create-user', createUserManually);
router.get('/user/:clerkUserId', getUserByClerkId);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Auth routes are working' });
});

// Add admin routes
router.use('/admin', require('./admin'));

// Sync user data from Clerk to our database
router.post('/sync-user', async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName, role = 'student' } = req.body;

    console.log('🔄 Syncing user:', email);

    if (!clerkUserId || !email) {
      return res.status(400).json({ 
        success: false,
        message: 'clerkUserId and email are required' 
      });
    }

    // Find or create user
    const user = await User.findOneAndUpdate(
      { clerkUserId },
      {
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        role,
        isActive: true
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    console.log('✅ User synced successfully:', user.email);

    res.status(200).json({
      success: true,
      message: 'User synced successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error('❌ Error syncing user:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// Debug endpoint to check token
router.get('/debug/token', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Check if it's a temporary token
    if (token.startsWith('temp-admin-token-') || token.startsWith('admin-token-')) {
      return res.json({
        valid: true,
        type: 'temporary',
        token: token
      });
    }

    // Try to verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    res.json({
      valid: true,
      type: 'jwt',
      decoded: decoded,
      token: token
    });
  } catch (error) {
    res.json({
      valid: false,
      error: error.message,
      token: token
    });
  }
});

// Debug endpoint to check all tokens in use
router.get('/debug/tokens', (req, res) => {
  // This is just for debugging - in production you'd use a proper token store
  res.json({
    currentToken: req.header('Authorization'),
    storedToken: req.headers['stored-token'],
    message: 'For debugging purposes only'
  });
});

module.exports = router;