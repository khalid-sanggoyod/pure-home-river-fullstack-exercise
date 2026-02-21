import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './agentValidator';
import { familyRepository } from '../repositories/familyRepository';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]+$/;

function validateNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateUUID(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/[\s\-+()]/g, '');
  return PHONE_REGEX.test(phone) && digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

export function validateCreateTenant(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { firstName, lastName, email, phone, familyId } = req.body;

  if (!validateNonEmptyString(firstName)) {
    errors.push({ field: 'firstName', message: 'First name is required and must be a non-empty string' });
  }

  if (!validateNonEmptyString(lastName)) {
    errors.push({ field: 'lastName', message: 'Last name is required and must be a non-empty string' });
  }

  if (email !== undefined && email !== null && email !== '') {
    if (!validateEmail(email)) {
      errors.push({ field: 'email', message: 'Email must be a valid email address' });
    }
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (!validatePhone(phone)) {
      errors.push({ field: 'phone', message: 'Phone must be a valid phone number (7-15 digits)' });
    }
  }

  if (!validateUUID(familyId)) {
    errors.push({ field: 'familyId', message: 'Family ID is required and must be a valid UUID' });
  } else if (!familyRepository.getById(familyId)) {
    errors.push({ field: 'familyId', message: 'Family not found' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateUpdateTenant(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { firstName, lastName, email, phone, familyId } = req.body;

  if (firstName !== undefined && !validateNonEmptyString(firstName)) {
    errors.push({ field: 'firstName', message: 'First name must be a non-empty string' });
  }

  if (lastName !== undefined && !validateNonEmptyString(lastName)) {
    errors.push({ field: 'lastName', message: 'Last name must be a non-empty string' });
  }

  if (email !== undefined && email !== null && email !== '') {
    if (!validateEmail(email)) {
      errors.push({ field: 'email', message: 'Email must be a valid email address' });
    }
  }

  if (phone !== undefined && phone !== null && phone !== '') {
    if (!validatePhone(phone)) {
      errors.push({ field: 'phone', message: 'Phone must be a valid phone number (7-15 digits)' });
    }
  }

  if (familyId !== undefined) {
    if (!validateUUID(familyId)) {
      errors.push({ field: 'familyId', message: 'Family ID must be a valid UUID' });
    } else if (!familyRepository.getById(familyId)) {
      errors.push({ field: 'familyId', message: 'Family not found' });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
