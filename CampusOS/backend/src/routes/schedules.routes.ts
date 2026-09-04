import { Router } from 'express';
import { ScheduleController } from '../controllers/schedules.controller';
import { validate } from '../middleware/validation.middleware';
import { createScheduleSchema, updateScheduleSchema } from '../validators/schedule.validator';

const router = Router();

router.get('/', ScheduleController.list);
router.get('/:id', ScheduleController.getById);
router.post('/', validate(createScheduleSchema), ScheduleController.create);
router.put('/:id', validate(updateScheduleSchema), ScheduleController.update);
router.delete('/:id', ScheduleController.remove);

export default router;
