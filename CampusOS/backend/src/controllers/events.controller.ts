import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/events.service';
import { AppError } from '../middleware/error.middleware';

export class EventController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, venue, organizer, date } = req.query;
      const events = await EventService.list({
        status: status as string | undefined,
        venue: venue as string | undefined,
        organizer: organizer as string | undefined,
        date: date as string | undefined,
      });
      res.json(events);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.getById(req.params.id as string);
      res.json(event);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.create(req.body);
      res.status(201).json(event);
    } catch (err) {
      if ((err as any).code === '23505') {
        return next(new AppError('Event with this ID already exists', 409));
      }
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.update(req.params.id as string, req.body);
      res.json(event);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await EventService.delete(req.params.id as string);
      res.json({ message: 'Event deleted', event });
    } catch (err) {
      next(err);
    }
  }

  // ── registrations ─────────────────────────────────
  static async addRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const reg = await EventService.addRegistration({ event_id: req.params.id as string, ...req.body });
      res.status(201).json(reg);
    } catch (err) {
      next(err);
    }
  }

  static async removeRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const reg = await EventService.removeRegistration(req.params.id as string, req.params.studentId as string);
      res.json({ message: 'Registration removed', registration: reg });
    } catch (err) {
      next(err);
    }
  }
}
