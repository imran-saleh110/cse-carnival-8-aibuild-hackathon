import { Router } from 'express';
import { EventController } from '../controllers/events.controller';
import { validate } from '../middleware/validation.middleware';
import { createEventSchema, updateEventSchema, createRegistrationSchema } from '../validators/event.validator';

const router = Router();

router.get('/', EventController.list);
router.get('/:id', EventController.getById);
router.post('/', validate(createEventSchema), EventController.create);
router.put('/:id', validate(updateEventSchema), EventController.update);
router.delete('/:id', EventController.remove);

router.post('/:id/register', validate(createRegistrationSchema), EventController.addRegistration);
router.delete('/:id/register/:studentId', EventController.removeRegistration);

export default router;
