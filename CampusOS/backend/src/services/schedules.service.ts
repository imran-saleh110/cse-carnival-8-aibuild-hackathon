import { ScheduleModel } from '../models/Schedule';
import { CreateScheduleInput, UpdateScheduleInput, ScheduleFilters } from '../types/schedule.types';
import { AppError } from '../middleware/error.middleware';

export class ScheduleService {
  static async list(filters: ScheduleFilters) {
    return ScheduleModel.findAll(filters);
  }

  static async getById(id: string) {
    const schedule = await ScheduleModel.findById(id);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }
    return schedule;
  }

  static async create(data: CreateScheduleInput) {
    return ScheduleModel.create(data);
  }

  static async update(id: string, data: UpdateScheduleInput) {
    const schedule = await ScheduleModel.update(id, data);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }
    return schedule;
  }

  static async delete(id: string) {
    const schedule = await ScheduleModel.delete(id);
    if (!schedule) {
      throw new AppError('Schedule not found', 404);
    }
    return schedule;
  }
}
