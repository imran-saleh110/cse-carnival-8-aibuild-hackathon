import { z } from 'zod';

const VALID_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'] as const;

export const createScheduleSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  course: z.string().min(1, 'Course is required'),
  title: z.string().min(1, 'Title is required'),
  day: z.enum(VALID_DAYS, { errorMap: () => ({ message: 'Invalid day. Must be Sunday, Monday, Tuesday, Wednesday, or Thursday' }) }),
  start_time: z.string().min(1, 'Start time is required'),
  end_time: z.string().min(1, 'End time is required'),
  room: z.string().min(1, 'Room is required'),
  instructor: z.string().optional(),
  section: z.string().optional(),
});

export const updateScheduleSchema = z.object({
  course: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  day: z.enum(VALID_DAYS).optional(),
  start_time: z.string().min(1).optional(),
  end_time: z.string().min(1).optional(),
  room: z.string().min(1).optional(),
  instructor: z.string().optional(),
  section: z.string().optional(),
});
