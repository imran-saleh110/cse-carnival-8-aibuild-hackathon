import { AnnouncementModel } from '../models/Announcement';
import { CreateAnnouncementInput, UpdateAnnouncementInput, AnnouncementFilters } from '../types/announcement.types';
import { AppError } from '../middleware/error.middleware';

export class AnnouncementService {
  static async list(filters: AnnouncementFilters) {
    return AnnouncementModel.findAll(filters);
  }

  static async getById(id: string) {
    const ann = await AnnouncementModel.findById(id);
    if (!ann) throw new AppError('Announcement not found', 404);
    return ann;
  }

  static async create(data: CreateAnnouncementInput) {
    return AnnouncementModel.create(data);
  }

  static async update(id: string, data: UpdateAnnouncementInput) {
    const ann = await AnnouncementModel.update(id, data);
    if (!ann) throw new AppError('Announcement not found', 404);
    return ann;
  }

  static async delete(id: string) {
    const ann = await AnnouncementModel.delete(id);
    if (!ann) throw new AppError('Announcement not found', 404);
    return ann;
  }
}
