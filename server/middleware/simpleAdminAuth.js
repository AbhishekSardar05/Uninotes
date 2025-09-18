const simpleAdminAuth = (req, res, next) => {
  const { username, password } = req.body;
  
  // Hardcoded admin credentials for development
  const ADMINS = [
    { username: 'abhishek05', password: 'abhishek@380', email: 'abhisheksardar127@gmail.com' }
  ];
  
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  
  if (admin) {
    req.adminUser = admin;
    next();
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }
};

module.exports = simpleAdminAuth;