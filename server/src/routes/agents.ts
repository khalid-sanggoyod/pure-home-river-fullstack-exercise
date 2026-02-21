import { Router } from 'express';
import * as agentController from '../controllers/agentController';
import { validateCreateAgent, validateUpdateAgent } from '../validators/agentValidator';

const router = Router();

router.get('/', agentController.getAll);
router.get('/:id', agentController.getById);
router.post('/', validateCreateAgent, agentController.create);
router.put('/:id', validateUpdateAgent, agentController.update);
router.delete('/:id', agentController.remove);

export default router;
