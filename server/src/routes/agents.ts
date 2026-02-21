import { Router } from 'express';
import * as agentController from '../controllers/agentController';
import { validateCreateAgent, validateUpdateAgent } from '../validators/agentValidator';
import { mutationLimiter } from '../middleware/rateLimiter';

const router = Router();

router.get('/', agentController.getAll);
router.get('/:id', agentController.getById);
router.post('/', mutationLimiter, validateCreateAgent, agentController.create);
router.put('/:id', mutationLimiter, validateUpdateAgent, agentController.update);
router.delete('/:id', mutationLimiter, agentController.remove);

export default router;
