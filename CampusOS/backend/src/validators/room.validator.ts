import { z } from 'zod';

const ROOM_TYPES = ['classroom', 'lab', 'seminar'] as const;
const ROOM_STATUSES = ['available', 'unavailable'] as const;
const BOOKING_STATUSES = ['active', 'cancelled', 'completed'] as const;

export const createRoomSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  room_number: z.string().min(1, 'Room number is required'),
  type: z.enum(ROOM_TYPES, { errorMap: () => ({ message: 'Invalid type. Must be classroom, lab, or seminar' }) }),
  capacity: z.number().int().positive('Capacity must be positive'),
  floor: z.number().int(),
  status: z.enum(ROOM_STATUSES).optional(),
  equipment: z.array(z.string()).optional(),
});

export const updateRoomSchema = z.object({
  room_number: z.string().min(1).optional(),
  type: z.enum(ROOM_TYPES).optional(),
  capacity: z.number().int().positive().optional(),
  floor: z.number().int().optional(),
  status: z.enum(ROOM_STATUSES).optional(),
  equipment: z.array(z.string()).optional(),
});

export const createBookingSchema = z.object({
  booking_id: z.string().min(1, 'Booking ID is required'),
  room_id: z.string().min(1, 'Room ID is required'),
  booked_by: z.string().min(1, 'Booked by is required'),
  booking_date: z.string().min(1, 'Booking date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  purpose: z.string().optional(),
});

export const updateBookingSchema = z.object({
  booked_by: z.string().min(1).optional(),
  booking_date: z.string().min(1).optional(),
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
  purpose: z.string().optional(),
  status: z.enum(BOOKING_STATUSES).optional(),
});
