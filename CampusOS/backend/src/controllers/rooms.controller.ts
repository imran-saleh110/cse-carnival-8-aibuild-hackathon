import { Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/rooms.service';
import { AppError } from '../middleware/error.middleware';

export class RoomController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, status, min_capacity, floor } = req.query;
      const rooms = await RoomService.list({
        type: type as string | undefined,
        status: status as string | undefined,
        min_capacity: min_capacity ? parseInt(min_capacity as string) : undefined,
        floor: floor ? parseInt(floor as string) : undefined,
      });
      res.json(rooms);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await RoomService.getById(req.params.id as string);
      res.json(room);
    } catch (err) {
      next(err);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await RoomService.create(req.body);
      res.status(201).json(room);
    } catch (err) {
      if ((err as any).code === '23505') {
        return next(new AppError('Room with this ID or number already exists', 409));
      }
      next(err);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await RoomService.update(req.params.id as string, req.body);
      res.json(room);
    } catch (err) {
      next(err);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const room = await RoomService.delete(req.params.id as string);
      res.json({ message: 'Room deleted', room });
    } catch (err) {
      next(err);
    }
  }

  // ── bookings ──────────────────────────────────────
  static async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await RoomService.createBooking(req.body);
      res.status(201).json(booking);
    } catch (err) {
      if ((err as any).code === '23505') {
        return next(new AppError('Booking with this ID already exists', 409));
      }
      next(err);
    }
  }

  static async updateBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await RoomService.updateBooking(req.params.bookingId as string, req.body);
      res.json(booking);
    } catch (err) {
      next(err);
    }
  }

  static async removeBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await RoomService.deleteBooking(req.params.bookingId as string);
      res.json({ message: 'Booking deleted', booking });
    } catch (err) {
      next(err);
    }
  }
}
