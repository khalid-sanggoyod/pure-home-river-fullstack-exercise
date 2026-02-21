import { Request, Response, NextFunction } from 'express';
import { ValidationError } from './agentValidator';
import { agentRepository } from '../repositories/agentRepository';

function validateNonEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length > 0;
}

function validateUUID(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function validateCreateProperty(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { address, agentId } = req.body;

  if (!validateNonEmptyString(address)) {
    errors.push({ field: 'address', message: 'Address is required and must be a non-empty string' });
  }

  if (!validateUUID(agentId)) {
    errors.push({ field: 'agentId', message: 'Agent ID is required and must be a valid UUID' });
  } else if (!agentRepository.getById(agentId)) {
    errors.push({ field: 'agentId', message: 'Agent not found' });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}

export function validateUpdateProperty(req: Request, res: Response, next: NextFunction): void {
  const errors: ValidationError[] = [];
  const { address, agentId } = req.body;

  if (address !== undefined && !validateNonEmptyString(address)) {
    errors.push({ field: 'address', message: 'Address must be a non-empty string' });
  }

  if (agentId !== undefined) {
    if (!validateUUID(agentId)) {
      errors.push({ field: 'agentId', message: 'Agent ID must be a valid UUID' });
    } else if (!agentRepository.getById(agentId)) {
      errors.push({ field: 'agentId', message: 'Agent not found' });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  next();
}
