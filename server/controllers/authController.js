const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Webhook handler for Clerk user events
const handleClerkWebhook = async (req, res) => {
  try {
    const event = req.webhookEvent;
    const { type, data } = event;

    console.log('Processing webhook event:', type);

    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = data;
      const email = email_addresses[0]?.email_address;

      if (!id || !email) {
        return res.status(400).json({ message: 'Missing required user data' });
      }

      // Update or create user in our database
      const user = await User.findOneAndUpdate(
        { clerkUserId: id },
        {
          email,
          firstName: first_name || '',
          lastName: last_name || '',
          role: 'student' // Default role
        },
        { upsert: true, new: true, runValidators: true }
      );

      console.log(`User ${email} synced with database`);
    } else if (type === 'user.deleted') {
      const { id } = data;
      
      // Soft delete user from our database
      await User.findOneAndUpdate(
        { clerkUserId: id },
        { isActive: false }
      );
      
      console.log(`User ${id} marked as inactive`);
    }

    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Manual user sync endpoint
const syncUserManual = async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName, role = 'student' } = req.body;

    if (!clerkUserId || !email) {
      return res.status(400).json({ 
        message: 'clerkUserId and email are required' 
      });
    }

    const user = await User.findOneAndUpdate(
      { clerkUserId },
      {
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        role
      },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({
      message: 'User synced successfully',
      user
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Manual user creation for development
const createUserManually = async (req, res) => {
  try {
    const { clerkUserId, email, firstName, lastName, role } = req.body;
    
    const user = await User.findOneAndUpdate(
      { clerkUserId },
      {
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || 'student'
      },
      { upsert: true, new: true }
    );

    const token = generateToken(user._id);
    
    res.status(200).json({
      message: 'User created/updated successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user by Clerk ID
const getUserByClerkId = async (req, res) => {
  try {
    const { clerkUserId } = req.params;
    
    const user = await User.findOne({ clerkUserId });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { 
  handleClerkWebhook, 
  syncUserManual,
  createUserManually, 
  getUserByClerkId 
};