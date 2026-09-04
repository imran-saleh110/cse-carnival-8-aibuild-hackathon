import { Request, Response, NextFunction } from 'express';
import { ScheduleService } from '../services/schedules.service';
import { AppError } from '../middleware/error.middleware';

export class ScheduleController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, day, room, instructor } = req.query;
      const filters = {
        course: course as string | undefined,
        day: day as string | undefined,
        room: room as string | undefined,
        instructor: instructor as string | undefined,
      };
      const schedules = await ScheduleService.list(filters);
      res.json(schedules);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.getById(req.params.id);
      res.json(schedule);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.create(req.body);
      res.status(201).json(schedule);
    } catch (err) {
      if ((err as any).code === '23505') {
        return next(new AppError('Schedule with this ID already exists', 409));
      }
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.update(req.params.id, req.body);
      res.json(schedule);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const schedule = await ScheduleService.delete(req.params.id);
      res.json({ message: 'Schedule deleted', schedule });
    } catch (err) {
      next(err);
    }
  }
}
