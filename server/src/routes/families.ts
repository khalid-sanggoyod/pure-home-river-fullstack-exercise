import { Router } from 'express';
import * as familyController from '../controllers/familyController';
import { validateCreateFamily, validateUpdateFamily } from '../validators/familyValidator';

const router = Router();

router.get('/', familyController.getAll);
router.get('/:id', familyController.getById);
router.post('/', validateCreateFamily, familyController.create);
router.put('/:id', validateUpdateFamily, familyController.update);
router.delete('/:id', familyController.remove);

export default router;
