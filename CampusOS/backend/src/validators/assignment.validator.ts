import { z } from 'zod';

const ASSIGNMENT_STATUSES = ['pending', 'submitted', 'graded', 'late'] as const;

export const createAssignmentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  course: z.string().min(1, 'Course is required'),
  course_title: z.string().min(1, 'Course title is required'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assigned_date: z.string().min(1, 'Assigned date is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  submission_platform: z.string().optional(),
  status: z.enum(ASSIGNMENT_STATUSES).optional(),
  marks: z.number().int().min(0).optional(),
});

export const updateAssignmentSchema = z.object({
  course: z.string().min(1).optional(),
  course_title: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  assigned_date: z.string().min(1).optional(),
  deadline: z.string().min(1).optional(),
  submission_platform: z.string().optional(),
  status: z.enum(ASSIGNMENT_STATUSES).optional(),
  marks: z.number().int().min(0).optional(),
});
