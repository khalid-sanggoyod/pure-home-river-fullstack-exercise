import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './agentValidator';
import { propertyRepository } from '../repositories/propertyRepository';
import { familyRepository } from '../repositories/familyRepository';

function validateNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateUUID(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function validateCreateFamily(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { name, propertyId } = req.body;

  if (!validateNonEmptyString(name)) {
    errors.push({ field: 'name', message: 'Name is required and must be a non-empty string' });
  }

  if (!validateUUID(propertyId)) {
    errors.push({ field: 'propertyId', message: 'Property ID is required and must be a valid UUID' });
  } else {
    const property = propertyRepository.getById(propertyId);
    if (!property) {
      errors.push({ field: 'propertyId', message: 'Property not found' });
    } else if (familyRepository.isPropertyOccupied(propertyId)) {
      errors.push({ field: 'propertyId', message: 'Property already has a family assigned' });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateUpdateFamily(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { name, propertyId } = req.body;
  const familyId = req.params.id;

  if (name !== undefined && !validateNonEmptyString(name)) {
    errors.push({ field: 'name', message: 'Name must be a non-empty string' });
  }

  if (propertyId !== undefined) {
    if (!validateUUID(propertyId)) {
      errors.push({ field: 'propertyId', message: 'Property ID must be a valid UUID' });
    } else {
      const property = propertyRepository.getById(propertyId);
      if (!property) {
        errors.push({ field: 'propertyId', message: 'Property not found' });
      } else if (familyRepository.isPropertyOccupied(propertyId, familyId)) {
        errors.push({ field: 'propertyId', message: 'Property already has a family assigned' });
      }
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
