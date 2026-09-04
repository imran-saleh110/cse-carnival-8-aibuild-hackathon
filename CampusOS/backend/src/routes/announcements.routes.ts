import { Router } from 'express';
import { validate, asyncHandler } from '../middleware/validation.middleware';
import { createAnnouncementSchema, updateAnnouncementSchema } from '../validators/announcement.validator';
import {
  listAnnouncements, getAnnouncement, createAnnouncement, updateAnnouncement, deleteAnnouncement
} from '../controllers/announcements.controller';

const router = Router();

// GET    /api/announcements          — list all (filterable by priority, status, posted_by)
// GET    /api/announcements/:id      — get one by ID
// POST   /api/announcements          — create new
// PUT    /api/announcements/:id      — update by ID
// DELETE /api/announcements/:id      — delete by ID

router.get('/',     asyncHandler(listAnnouncements));
router.get('/:id',  asyncHandler(getAnnouncement));
router.post('/',    validate(createAnnouncementSchema),  asyncHandler(createAnnouncement));
router.put('/:id',  validate(updateAnnouncementSchema),  asyncHandler(updateAnnouncement));
router.delete('/:id', asyncHandler(deleteAnnouncement));

export default router;
