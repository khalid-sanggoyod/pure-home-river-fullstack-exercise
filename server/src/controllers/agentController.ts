import { Request, Response } from 'express';
import { agentRepository } from '../repositories/agentRepository';
import { AgentSearchParams } from '../models/agent';
import { sendSuccess, sendNotFound } from '../utils/apiResponse';

export const getAll = (req: Request, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page as string, 10) : undefined;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

  const searchParams: AgentSearchParams = {
    search: req.query.search as string | undefined,
    createdFrom: req.query.createdFrom as string | undefined,
    createdTo: req.query.createdTo as string | undefined,
    page: page && page > 0 ? page : undefined,
    limit: limit && limit > 0 ? limit : undefined,
  };

  const result = agentRepository.search(searchParams);
  sendSuccess(res, result);
};

export const getById = (req: Request, res: Response) => {
  const agent = agentRepository.getById(req.params.id);
  if (!agent) {
    sendNotFound(res);
    return;
  }
  sendSuccess(res, agent);
};

export const create = (req: Request, res: Response) => {
  const agent = agentRepository.create({
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    email: req.body.email.trim().toLowerCase(),
    mobileNumber: req.body.mobileNumber.trim(),
  });
  sendSuccess(res, agent, 201, 'Property Agent successfully created');
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
    sendNotFound(res);
    return;
  }
  sendSuccess(res, agent, 200, 'Property Agent successfully updated');
};

export const remove = (req: Request, res: Response) => {
  const deleted = agentRepository.delete(req.params.id);
  if (!deleted) {
    sendNotFound(res);
    return;
  }
  sendSuccess(res, null, 200, 'Property Agent successfully deleted');
};
