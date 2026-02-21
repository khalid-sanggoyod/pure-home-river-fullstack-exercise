import { Router } from 'express';
import * as propertyController from '../controllers/propertyController';
import { validateCreateProperty, validateUpdateProperty } from '../validators/propertyValidator';

const router = Router();

router.get('/', propertyController.getAll);
router.get('/:id', propertyController.getById);
router.post('/', validateCreateProperty, propertyController.create);
router.put('/:id', validateUpdateProperty, propertyController.update);
router.delete('/:id', propertyController.remove);

export default router;
