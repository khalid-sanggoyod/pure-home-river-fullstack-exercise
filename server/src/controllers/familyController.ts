import { Request, Response } from 'express';
import { familyRepository } from '../repositories/familyRepository';

export const getAll = (_req: Request, res: Response) => {
  const families = familyRepository.getAll();
  res.json(families);
};

export const getById = (req: Request, res: Response) => {
  const family = familyRepository.getById(req.params.id);
  if (!family) {
    res.status(404).json({ error: 'Family not found' });
    return;
  }
  res.json(family);
};

export const getByPropertyId = (req: Request, res: Response) => {
  const family = familyRepository.getByPropertyId(req.params.propertyId);
  if (!family) {
    res.status(404).json({ error: 'No family found for this property' });
    return;
  }
  res.json(family);
};

export const create = (req: Request, res: Response) => {
  const family = familyRepository.create({
    name: req.body.name.trim(),
    propertyId: req.body.propertyId,
  });
  res.status(201).json(family);
};

export const update = (req: Request, res: Response) => {
  const updateData: Record<string, string> = {};

  if (req.body.name !== undefined) {
    updateData.name = req.body.name.trim();
  }
  if (req.body.propertyId !== undefined) {
    updateData.propertyId = req.body.propertyId;
  }

  const family = familyRepository.update(req.params.id, updateData);
  if (!family) {
    res.status(404).json({ error: 'Family not found' });
    return;
  }
  res.json(family);
};

export const remove = (req: Request, res: Response) => {
  const deleted = familyRepository.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Family not found' });
    return;
  }
  res.status(204).send();
};
