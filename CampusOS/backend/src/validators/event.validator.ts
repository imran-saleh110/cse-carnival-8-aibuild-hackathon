import { z } from 'zod';

const EVENT_STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled', 'full'] as const;

export const createEventSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Start date is required'),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  end_date: z.string().min(1, 'End date is required'),
  venue: z.string().min(1, 'Venue is required'),
  organizer: z.string().min(1, 'Organizer is required'),
  capacity: z.number().int().positive('Capacity must be positive'),
  registered: z.number().int().min(0).optional(),
  status: z.enum(EVENT_STATUSES).optional(),
});

export const updateEventSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  start_date: z.string().min(1).optional(),
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
  end_date: z.string().min(1).optional(),
  venue: z.string().min(1).optional(),
  organizer: z.string().min(1).optional(),
  capacity: z.number().int().positive().optional(),
  registered: z.number().int().min(0).optional(),
  status: z.enum(EVENT_STATUSES).optional(),
});

export const createRegistrationSchema = z.object({
  event_id: z.string().min(1, 'Event ID is required'),
  student_id: z.string().min(1, 'Student ID is required'),
  student_name: z.string().min(1, 'Student name is required'),
});
