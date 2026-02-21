import { Request, Response } from 'express';
import { propertyRepository } from '../repositories/propertyRepository';

export const getAll = (_req: Request, res: Response) => {
  const properties = propertyRepository.getAll();
  res.json(properties);
};

export const getById = (req: Request, res: Response) => {
  const property = propertyRepository.getById(req.params.id);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json(property);
};

export const getByAgentId = (req: Request, res: Response) => {
  const properties = propertyRepository.getByAgentId(req.params.agentId);
  res.json(properties);
};

export const create = (req: Request, res: Response) => {
  const property = propertyRepository.create({
    address: req.body.address.trim(),
    agentId: req.body.agentId,
  });
  res.status(201).json(property);
};

export const update = (req: Request, res: Response) => {
  const updateData: Record<string, string> = {};

  if (req.body.address !== undefined) {
    updateData.address = req.body.address.trim();
  }
  if (req.body.agentId !== undefined) {
    updateData.agentId = req.body.agentId;
  }

  const property = propertyRepository.update(req.params.id, updateData);
  if (!property) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.json(property);
};

export const remove = (req: Request, res: Response) => {
  const deleted = propertyRepository.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Property not found' });
    return;
  }
  res.status(204).send();
};
