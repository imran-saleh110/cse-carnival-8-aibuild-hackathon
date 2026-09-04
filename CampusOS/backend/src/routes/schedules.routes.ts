import { Router } from 'express';
import { validate, asyncHandler } from '../middleware/validation.middleware';
import { createScheduleSchema, updateScheduleSchema } from '../validators/schedule.validator';
import {
  listSchedules, getSchedule, createSchedule, updateSchedule, deleteSchedule
} from '../controllers/schedules.controller';

const router = Router();

// GET    /api/schedules          — list all (filterable by course, day, room, instructor)
// GET    /api/schedules/:id      — get one by ID
// POST   /api/schedules          — create new
// PUT    /api/schedules/:id      — update by ID
// DELETE /api/schedules/:id      — delete by ID

router.get('/',     asyncHandler(listSchedules));
router.get('/:id',  asyncHandler(getSchedule));
router.post('/',    validate(createScheduleSchema),  asyncHandler(createSchedule));
router.put('/:id',  validate(updateScheduleSchema),  asyncHandler(updateSchedule));
router.delete('/:id', asyncHandler(deleteSchedule));

export default router;
