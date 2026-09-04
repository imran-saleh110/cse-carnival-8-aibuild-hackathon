import { z } from 'zod';

const PRIORITIES = ['high', 'medium', 'low'] as const;
const ANN_STATUSES = ['active', 'expired'] as const;

export const createAnnouncementSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  date: z.string().min(1, 'Announcement date is required'),
  priority: z.enum(PRIORITIES, { errorMap: () => ({ message: 'Invalid priority. Must be high, medium, or low' }) }),
  posted_by: z.string().min(1, 'Posted by is required'),
  expires_date: z.string().min(1, 'Expires date is required'),
});

export const updateAnnouncementSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
  date: z.string().min(1).optional(),
  priority: z.enum(PRIORITIES).optional(),
  posted_by: z.string().min(1).optional(),
  expires_date: z.string().min(1).optional(),
  status: z.enum(ANN_STATUSES).optional(),
});
