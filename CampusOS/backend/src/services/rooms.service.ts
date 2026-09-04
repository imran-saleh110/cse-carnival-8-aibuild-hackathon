import { RoomModel } from '../models/Room';
import { CreateRoomInput, UpdateRoomInput, RoomFilters, CreateBookingInput, UpdateBookingInput } from '../types/room.types';
import { AppError } from '../middleware/error.middleware';

export class RoomService {
  static async list(filters: RoomFilters) {
    return RoomModel.findAll(filters);
  }

  static async getById(id: string) {
    const room = await RoomModel.findById(id);
    if (!room) throw new AppError('Room not found', 404);
    return room;
  }

  static async create(data: CreateRoomInput) {
    return RoomModel.create(data);
  }

  static async update(id: string, data: UpdateRoomInput) {
    const room = await RoomModel.update(id, data);
    if (!room) throw new AppError('Room not found', 404);
    return room;
  }

  static async delete(id: string) {
    const room = await RoomModel.delete(id);
    if (!room) throw new AppError('Room not found', 404);
    return room;
  }

  // ── bookings ──────────────────────────────────────
  static async getBooking(bookingId: string) {
    const booking = await RoomModel.findBooking(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
  }

  static async createBooking(data: CreateBookingInput) {
    // Ensure room exists
    const room = await RoomModel.findById(data.room_id);
    if (!room) throw new AppError('Room not found', 404);
    return RoomModel.createBooking(data);
  }

  static async updateBooking(bookingId: string, data: UpdateBookingInput) {
    const booking = await RoomModel.updateBooking(bookingId, data);
    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
  }

  static async deleteBooking(bookingId: string) {
    const booking = await RoomModel.deleteBooking(bookingId);
    if (!booking) throw new AppError('Booking not found', 404);
    return booking;
  }
}
