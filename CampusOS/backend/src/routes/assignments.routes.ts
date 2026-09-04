import { Router } from 'express';
import { AssignmentController } from '../controllers/assignments.controller';
import { validate } from '../middleware/validation.middleware';
import { createAssignmentSchema, updateAssignmentSchema } from '../validators/assignment.validator';

const router = Router();

router.get('/', AssignmentController.list);
router.get('/:id', AssignmentController.getById);
router.post('/', validate(createAssignmentSchema), AssignmentController.create);
router.put('/:id', validate(updateAssignmentSchema), AssignmentController.update);
router.delete('/:id', AssignmentController.remove);

export default router;
