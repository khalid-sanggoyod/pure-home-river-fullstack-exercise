import { Request, Response } from 'express';
import { noteRepository } from '../repositories/noteRepository';

export const getAll = (_req: Request, res: Response) => {
  const notes = noteRepository.getAll();
  res.json(notes);
};

export const getById = (req: Request, res: Response) => {
  const note = noteRepository.getById(req.params.id);
  if (!note) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }
  res.json(note);
};

export const getByAgentId = (req: Request, res: Response) => {
  const notes = noteRepository.getByAgentId(req.params.agentId);
  res.json(notes);
};

export const getByPropertyId = (req: Request, res: Response) => {
  const notes = noteRepository.getByPropertyId(req.params.propertyId);
  res.json(notes);
};

export const create = (req: Request, res: Response) => {
  const note = noteRepository.create({
    title: req.body.title.trim(),
    content: req.body.content?.trim() || null,
    agentId: req.body.agentId,
    propertyId: req.body.propertyId || null,
    dueDate: req.body.dueDate || null,
    isReminder: req.body.isReminder || false,
  });
  res.status(201).json(note);
};

export const update = (req: Request, res: Response) => {
  const updateData: Record<string, string | boolean | null> = {};

  if (req.body.title !== undefined) {
    updateData.title = req.body.title.trim();
  }
  if (req.body.content !== undefined) {
    updateData.content = req.body.content?.trim() || null;
  }
  if (req.body.propertyId !== undefined) {
    updateData.propertyId = req.body.propertyId || null;
  }
  if (req.body.dueDate !== undefined) {
    updateData.dueDate = req.body.dueDate || null;
  }
  if (req.body.isReminder !== undefined) {
    updateData.isReminder = req.body.isReminder;
  }

  const note = noteRepository.update(req.params.id, updateData);
  if (!note) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }
  res.json(note);
};

export const remove = (req: Request, res: Response) => {
  const deleted = noteRepository.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Note not found' });
    return;
  }
  res.status(204).send();
};
