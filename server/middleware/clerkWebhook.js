const { Webhook } = require('svix');

const verifyWebhook = (req, res, next) => {
  // Skip verification in development mode for now
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Skipping webhook verification');
    req.webhookEvent = req.body;
    return next();
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    console.log('Webhook secret not configured, skipping verification');
    req.webhookEvent = req.body;
    return next();
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.warn('Missing Svix headers, skipping verification');
    req.webhookEvent = req.body;
    return next();
  }

  const wh = new Webhook(webhookSecret);
  let evt;

  try {
    const payload = JSON.stringify(req.body);
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
    
    req.webhookEvent = evt;
    next();
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return res.status(400).json({ message: "Verification failed" });
  }
};

module.exports = verifyWebhook;