import { Request, Response } from 'express';
import { agentRepository } from '../repositories/agentRepository';

export const getAll = (_req: Request, res: Response) => {
  const agents = agentRepository.getAll();
  res.json(agents);
};

export const getById = (req: Request, res: Response) => {
  const agent = agentRepository.getById(req.params.id);
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  res.json(agent);
};

export const create = (req: Request, res: Response) => {
  const agent = agentRepository.create({
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    email: req.body.email.trim().toLowerCase(),
    mobileNumber: req.body.mobileNumber.trim(),
  });
  res.status(201).json(agent);
};

export const update = (req: Request, res: Response) => {
  const updateData: Record<string, string> = {};

  if (req.body.firstName !== undefined) {
    updateData.firstName = req.body.firstName.trim();
  }
  if (req.body.lastName !== undefined) {
    updateData.lastName = req.body.lastName.trim();
  }
  if (req.body.email !== undefined) {
    updateData.email = req.body.email.trim().toLowerCase();
  }
  if (req.body.mobileNumber !== undefined) {
    updateData.mobileNumber = req.body.mobileNumber.trim();
  }

  const agent = agentRepository.update(req.params.id, updateData);
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  res.json(agent);
};

export const remove = (req: Request, res: Response) => {
  const deleted = agentRepository.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  res.status(204).send();
};
