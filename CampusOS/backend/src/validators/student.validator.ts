import { z } from 'zod';

export const createStudentSchema = z.object({
  student_id: z.string().min(1, 'Student ID is required'),
  student_name: z.string().min(1, 'Student name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const updateStudentSchema = z.object({
  student_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string().min(6).optional(),
});
