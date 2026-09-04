import { z } from 'zod';

export const createCourseSchema = z.object({
  course_code: z.string().min(1, 'Course code is required'),
  course_title: z.string().min(1, 'Course title is required'),
  department: z.string().optional(),
  credits: z.number().int().positive().optional(),
});

export const updateCourseSchema = z.object({
  course_title: z.string().min(1).optional(),
  department: z.string().optional(),
  credits: z.number().int().positive().optional(),
});
