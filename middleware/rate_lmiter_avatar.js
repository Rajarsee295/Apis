const rateLimit = require('express-rate-limit');

const uploadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 uploads per user
  message: {
    status: 429,
    error: 'Too many uploads. Please try again later.',
  },
  keyGenerator: (req) => req.user?.id || req.ip, // fallback to IP
});

module.exports = uploadRateLimiter;