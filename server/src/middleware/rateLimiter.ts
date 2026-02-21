import rateLimit from 'express-rate-limit';

const isTest = process.env.NODE_ENV === 'test';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 100,
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

// Stricter limiter for create/update operations
export const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 30,
  message: {
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});
