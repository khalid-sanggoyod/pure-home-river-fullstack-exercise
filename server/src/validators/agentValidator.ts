import { Request, Response, NextFunction } from 'express';
import { sendValidationError } from '../utils/apiResponse';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]+$/;

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/[\s\-+()]/g, '');
  return PHONE_REGEX.test(phone) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

function validateNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

export function validateCreateAgent(req: Request, res: Response, next: NextFunction): void {
  const { firstName, lastName, email, mobileNumber } = req.body;

  if (!validateNonEmptyString(firstName)) {
    sendValidationError(res, 'First name is required');
    return;
  }

  if (!validateNonEmptyString(lastName)) {
    sendValidationError(res, 'Last name is required');
    return;
  }

  if (!validateNonEmptyString(email)) {
    sendValidationError(res, 'Email is required');
    return;
  }

  if (!validateEmail(email)) {
    sendValidationError(res, 'Email format is invalid');
    return;
  }

  if (!validateNonEmptyString(mobileNumber)) {
    sendValidationError(res, 'Mobile number is required');
    return;
  }

  if (!validatePhone(mobileNumber)) {
    sendValidationError(res, 'Mobile number must be a valid phone number (7-15 digits)');
    return;
  }

  next();
}

export function validateUpdateAgent(req: Request, res: Response, next: NextFunction): void {
  const { firstName, lastName, email, mobileNumber } = req.body;

  if (firstName !== undefined && !validateNonEmptyString(firstName)) {
    sendValidationError(res, 'First name must be a non-empty string');
    return;
  }

  if (lastName !== undefined && !validateNonEmptyString(lastName)) {
    sendValidationError(res, 'Last name must be a non-empty string');
    return;
  }

  if (email !== undefined) {
    if (!validateNonEmptyString(email)) {
      sendValidationError(res, 'Email must be a non-empty string');
      return;
    }
    if (!validateEmail(email)) {
      sendValidationError(res, 'Email format is invalid');
      return;
    }
  }

  if (mobileNumber !== undefined) {
    if (!validateNonEmptyString(mobileNumber)) {
      sendValidationError(res, 'Mobile number must be a non-empty string');
      return;
    }
    if (!validatePhone(mobileNumber)) {
      sendValidationError(res, 'Mobile number must be a valid phone number (7-15 digits)');
      return;
    }
  }

  next();
}
