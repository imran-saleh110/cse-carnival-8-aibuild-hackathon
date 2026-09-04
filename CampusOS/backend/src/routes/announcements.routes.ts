import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcements.controller';
import { validate } from '../middleware/validation.middleware';
import { createAnnouncementSchema, updateAnnouncementSchema } from '../validators/announcement.validator';

const router = Router();

router.get('/', AnnouncementController.list);
router.get('/:id', AnnouncementController.getById);
router.post('/', validate(createAnnouncementSchema), AnnouncementController.create);
router.put('/:id', validate(updateAnnouncementSchema), AnnouncementController.update);
router.delete('/:id', AnnouncementController.remove);

export default router;
