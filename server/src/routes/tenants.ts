import { Router } from 'express';
import * as tenantController from '../controllers/tenantController';
import { validateCreateTenant, validateUpdateTenant } from '../validators/tenantValidator';

const router = Router();

router.get('/', tenantController.getAll);
router.get('/:id', tenantController.getById);
router.post('/', validateCreateTenant, tenantController.create);
router.put('/:id', validateUpdateTenant, tenantController.update);
router.delete('/:id', tenantController.remove);

export default router;
