import rateLimit from 'express-rate-limit'

export const authRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  skipSuccessfulRequests: true,
  message: { error: 'Too many failed attempts. Access locked for 10 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})
