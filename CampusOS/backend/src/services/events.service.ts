import { EventModel } from '../models/Event';
import { CreateEventInput, UpdateEventInput, EventFilters, CreateRegistrationInput } from '../types/event.types';
import { AppError } from '../middleware/error.middleware';

export class EventService {
  static async list(filters: EventFilters) {
    return EventModel.findAll(filters);
  }

  static async getById(id: string) {
    const event = await EventModel.findById(id);
    if (!event) throw new AppError('Event not found', 404);
    return event;
  }

  static async create(data: CreateEventInput) {
    return EventModel.create(data);
  }

  static async update(id: string, data: UpdateEventInput) {
    const event = await EventModel.update(id, data);
    if (!event) throw new AppError('Event not found', 404);
    return event;
  }

  static async delete(id: string) {
    const event = await EventModel.delete(id);
    if (!event) throw new AppError('Event not found', 404);
    return event;
  }

  // ── registrations ─────────────────────────────────
  static async addRegistration(data: CreateRegistrationInput) {
    const event = await EventModel.findById(data.event_id);
    if (!event) throw new AppError('Event not found', 404);

    const existing = await EventModel.findRegistration(data.event_id, data.student_id);
    if (existing) throw new AppError('Student already registered for this event', 409);

    if (event.registered >= event.capacity) {
      throw new AppError('Event is full', 400);
    }

    return EventModel.addRegistration(data);
  }

  static async removeRegistration(eventId: string, studentId: string) {
    const reg = await EventModel.removeRegistration(eventId, studentId);
    if (!reg) throw new AppError('Registration not found', 404);
    return reg;
  }
}
