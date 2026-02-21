import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './agentValidator';
import { agentRepository } from '../repositories/agentRepository';
import { propertyRepository } from '../repositories/propertyRepository';

function validateNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateUUID(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

function validateISODate(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

export function validateCreateNote(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { title, agentId, propertyId, dueDate, isReminder } = req.body;

  if (!validateNonEmptyString(title)) {
    errors.push({ field: 'title', message: 'Title is required and must be a non-empty string' });
  }

  if (!validateUUID(agentId)) {
    errors.push({ field: 'agentId', message: 'Agent ID is required and must be a valid UUID' });
  } else if (!agentRepository.getById(agentId)) {
    errors.push({ field: 'agentId', message: 'Agent not found' });
  }

  if (propertyId !== undefined && propertyId !== null) {
    if (!validateUUID(propertyId)) {
      errors.push({ field: 'propertyId', message: 'Property ID must be a valid UUID' });
    } else if (!propertyRepository.getById(propertyId)) {
      errors.push({ field: 'propertyId', message: 'Property not found' });
    }
  }

  if (dueDate !== undefined && dueDate !== null) {
    if (!validateISODate(dueDate)) {
      errors.push({ field: 'dueDate', message: 'Due date must be a valid ISO date string' });
    }
  }

  if (isReminder !== undefined && typeof isReminder !== 'boolean') {
    errors.push({ field: 'isReminder', message: 'isReminder must be a boolean' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateUpdateNote(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { title, propertyId, dueDate, isReminder } = req.body;

  if (title !== undefined && !validateNonEmptyString(title)) {
    errors.push({ field: 'title', message: 'Title must be a non-empty string' });
  }

  if (propertyId !== undefined && propertyId !== null) {
    if (!validateUUID(propertyId)) {
      errors.push({ field: 'propertyId', message: 'Property ID must be a valid UUID' });
    } else if (!propertyRepository.getById(propertyId)) {
      errors.push({ field: 'propertyId', message: 'Property not found' });
    }
  }

  if (dueDate !== undefined && dueDate !== null) {
    if (!validateISODate(dueDate)) {
      errors.push({ field: 'dueDate', message: 'Due date must be a valid ISO date string' });
    }
  }

  if (isReminder !== undefined && typeof isReminder !== 'boolean') {
    errors.push({ field: 'isReminder', message: 'isReminder must be a boolean' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
