import { Request, Response, NextFunction } from 'express';

export interface ValidationError {
  field: string;
  message: string;
}

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
  const errors: ValidationError[] = [];
  const { firstName, lastName, email, mobileNumber } = req.body;

  if (!validateNonEmptyString(firstName)) {
    errors.push({ field: 'firstName', message: 'First name is required and must be a non-empty string' });
  }

  if (!validateNonEmptyString(lastName)) {
    errors.push({ field: 'lastName', message: 'Last name is required and must be a non-empty string' });
  }

  if (!validateNonEmptyString(email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(email)) {
    errors.push({ field: 'email', message: 'Email must be a valid email address' });
  }

  if (!validateNonEmptyString(mobileNumber)) {
    errors.push({ field: 'mobileNumber', message: 'Mobile number is required' });
  } else if (!validatePhone(mobileNumber)) {
    errors.push({ field: 'mobileNumber', message: 'Mobile number must be a valid phone number (7-15 digits)' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateUpdateAgent(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { firstName, lastName, email, mobileNumber } = req.body;

  if (firstName !== undefined && !validateNonEmptyString(firstName)) {
    errors.push({ field: 'firstName', message: 'First name must be a non-empty string' });
  }

  if (lastName !== undefined && !validateNonEmptyString(lastName)) {
    errors.push({ field: 'lastName', message: 'Last name must be a non-empty string' });
  }

  if (email !== undefined) {
    if (!validateNonEmptyString(email)) {
      errors.push({ field: 'email', message: 'Email must be a non-empty string' });
    } else if (!validateEmail(email)) {
      errors.push({ field: 'email', message: 'Email must be a valid email address' });
    }
  }

  if (mobileNumber !== undefined) {
    if (!validateNonEmptyString(mobileNumber)) {
      errors.push({ field: 'mobileNumber', message: 'Mobile number must be a non-empty string' });
    } else if (!validatePhone(mobileNumber)) {
      errors.push({ field: 'mobileNumber', message: 'Mobile number must be a valid phone number (7-15 digits)' });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
