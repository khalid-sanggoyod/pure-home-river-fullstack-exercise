import { Request, Response } from 'express';
import { tenantRepository } from '../repositories/tenantRepository';

export const getAll = (_req: Request, res: Response) => {
  const tenants = tenantRepository.getAll();
  res.json(tenants);
};

export const getById = (req: Request, res: Response) => {
  const tenant = tenantRepository.getById(req.params.id);
  if (!tenant) {
    res.status(404).json({ error: 'Tenant not found' });
    return;
  }
  res.json(tenant);
};

export const getByFamilyId = (req: Request, res: Response) => {
  const tenants = tenantRepository.getByFamilyId(req.params.familyId);
  res.json(tenants);
};

export const create = (req: Request, res: Response) => {
  const tenant = tenantRepository.create({
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    email: req.body.email?.trim()?.toLowerCase() || null,
    phone: req.body.phone?.trim() || null,
    familyId: req.body.familyId,
  });
  res.status(201).json(tenant);
};

export const update = (req: Request, res: Response) => {
  const updateData: Record<string, string | null> = {};

  if (req.body.firstName !== undefined) {
    updateData.firstName = req.body.firstName.trim();
  }
  if (req.body.lastName !== undefined) {
    updateData.lastName = req.body.lastName.trim();
  }
  if (req.body.email !== undefined) {
    updateData.email = req.body.email?.trim()?.toLowerCase() || null;
  }
  if (req.body.phone !== undefined) {
    updateData.phone = req.body.phone?.trim() || null;
  }
  if (req.body.familyId !== undefined) {
    updateData.familyId = req.body.familyId;
  }

  const tenant = tenantRepository.update(req.params.id, updateData);
  if (!tenant) {
    res.status(404).json({ error: 'Tenant not found' });
    return;
  }
  res.json(tenant);
};

export const remove = (req: Request, res: Response) => {
  const deleted = tenantRepository.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Tenant not found' });
    return;
  }
  res.status(204).send();
};
