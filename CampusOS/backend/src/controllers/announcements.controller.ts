import { Request, Response, NextFunction } from 'express';
import { AnnouncementService } from '../services/announcements.service';
import { AppError } from '../middleware/error.middleware';

export class AnnouncementController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { priority, status, posted_by } = req.query;
      const announcements = await AnnouncementService.list({
        priority: priority as string | undefined,
        status: status as string | undefined,
        posted_by: posted_by as string | undefined,
      });
      res.json(announcements);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const ann = await AnnouncementService.getById(req.params.id as string);
      res.json(ann);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const ann = await AnnouncementService.create(req.body);
      res.status(201).json(ann);
    } catch (err) {
      if ((err as any).code === '23505') {
        return next(new AppError('Announcement with this ID already exists', 409));
      }
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const ann = await AnnouncementService.update(req.params.id as string, req.body);
      res.json(ann);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const ann = await AnnouncementService.delete(req.params.id as string);
      res.json({ message: 'Announcement deleted', announcement: ann });
    } catch (err) {
      next(err);
    }
  }
}
