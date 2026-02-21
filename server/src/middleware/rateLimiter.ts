import rateLimit from 'express-rate-limit';
import { ErrorCodes } from '../utils/apiResponse';

const isTest = process.env.NODE_ENV === 'test';

const rateLimitResponse = {
  success: false,
  error: {
    code: ErrorCodes.RATE_LIMIT_EXCEEDED,
    message: 'Too many requests, please try again later',
  },
};

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 100,
  message: rateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});

// Stricter limiter for create/update operations
export const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 30,
  message: rateLimitResponse,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => isTest,
});
