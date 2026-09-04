import { Router } from 'express';
import { validate, asyncHandler } from '../middleware/validation.middleware';
import { createEventSchema, updateEventSchema, createRegistrationSchema } from '../validators/event.validator';
import {
  listEvents, getEvent, createEvent, updateEvent, deleteEvent,
  registerForEvent, unregisterFromEvent
} from '../controllers/events.controller';

const router = Router();

// GET    /api/events                         — list all (filterable by status, venue, organizer, date)
// GET    /api/events/:id                     — get one with registrations
// POST   /api/events                         — create new
// PUT    /api/events/:id                     — update by ID
// DELETE /api/events/:id                     — delete by ID (cascades registrations)
// POST   /api/events/:id/register            — register student (body: student_id, student_name)
// DELETE /api/events/:id/register/:studentId — unregister student

router.get('/',          asyncHandler(listEvents));
router.get('/:id',       asyncHandler(getEvent));
router.post('/',         validate(createEventSchema),  asyncHandler(createEvent));
router.put('/:id',       validate(updateEventSchema),  asyncHandler(updateEvent));
router.delete('/:id',    asyncHandler(deleteEvent));

router.post('/:id/register',            validate(createRegistrationSchema),  asyncHandler(registerForEvent));
router.delete('/:id/register/:studentId',  asyncHandler(unregisterFromEvent));

export default router;
