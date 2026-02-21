import { Router } from 'express';
import * as noteController from '../controllers/noteController';
import { validateCreateNote, validateUpdateNote } from '../validators/noteValidator';

const router = Router();

router.get('/', noteController.getAll);
router.get('/:id', noteController.getById);
router.post('/', validateCreateNote, noteController.create);
router.put('/:id', validateUpdateNote, noteController.update);
router.delete('/:id', noteController.remove);

export default router;
