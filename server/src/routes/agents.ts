import { Router, Request, Response } from 'express';
import { agentStore } from '../store/agentStore';
import { validateCreateAgent, validateUpdateAgent } from '../validators/agentValidator';

const router = Router();

// GET /api/agents - List all agents
router.get('/', (req: Request, res: Response) => {
  const agents = agentStore.getAll();
  res.json(agents);
});

// GET /api/agents/:id - Get single agent
router.get('/:id', (req: Request, res: Response) => {
  const agent = agentStore.getById(req.params.id);
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  res.json(agent);
});

// POST /api/agents - Create agent
router.post('/', validateCreateAgent, (req: Request, res: Response) => {
  const agent = agentStore.create({
    firstName: req.body.firstName.trim(),
    lastName: req.body.lastName.trim(),
    email: req.body.email.trim().toLowerCase(),
    mobileNumber: req.body.mobileNumber.trim(),
  });
  res.status(201).json(agent);
});

// PUT /api/agents/:id - Update agent
router.put('/:id', validateUpdateAgent, (req: Request, res: Response) => {
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

  const agent = agentStore.update(req.params.id, updateData);
  if (!agent) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  res.json(agent);
});

// DELETE /api/agents/:id - Delete agent
router.delete('/:id', (req: Request, res: Response) => {
  const deleted = agentStore.delete(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Agent not found' });
    return;
  }
  res.status(204).send();
});

export default router;
