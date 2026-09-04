import { Request, Response, NextFunction } from 'express';
import { AssignmentService } from '../services/assignments.service';
import { AppError } from '../middleware/error.middleware';

export class AssignmentController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { course, status } = req.query;
      const assignments = await AssignmentService.list({
        course: course as string | undefined,
        status: status as string | undefined,
      });
      res.json(assignments);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const asgn = await AssignmentService.getById(req.params.id as string);
      res.json(asgn);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const asgn = await AssignmentService.create(req.body);
      res.status(201).json(asgn);
    } catch (err) {
      if ((err as any).code === '23505') {
        return next(new AppError('Assignment with this ID already exists', 409));
      }
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const asgn = await AssignmentService.update(req.params.id as string, req.body);
      res.json(asgn);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const asgn = await AssignmentService.delete(req.params.id as string);
      res.json({ message: 'Assignment deleted', assignment: asgn });
    } catch (err) {
      next(err);
    }
  }
}
