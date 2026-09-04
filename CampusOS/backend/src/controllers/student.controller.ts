import { Request, Response } from 'express';
import { StudentModel } from '../models/Student';
import { RefreshTokenModel } from '../models/RefreshToken';
import { hashPassword } from '../utils/auth';

export const getAllStudents = async (_req: Request, res: Response) => {
  const students = await StudentModel.findAll();
  return res.status(200).json(students);
};

export const getProfile = async (req: Request, res: Response) => {
  const student = await StudentModel.findById(req.user!.id);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  return res.status(200).json(student);
};

export const createStudent = async (req: Request, res: Response) => {
  const { student_id, student_name, email, phone, password } = req.body;

  const existingStudent = await StudentModel.findByEmail(email);
  if (existingStudent) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const hashedPassword = await hashPassword(password);

  const student = await StudentModel.create({
    student_id,
    student_name,
    email,
    phone,
    password: hashedPassword,
  });

  return res.status(201).json(student);
};

export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id !== req.user!.id) {
    return res.status(403).json({ error: 'You can only update your own account' });
  }

  const { student_name, email, phone, password } = req.body;

  const hashedPassword = password ? await hashPassword(password) : undefined;

  const existingStudent = await StudentModel.findByEmail(email);
  if (existingStudent && existingStudent.student_id !== id) {
    return res.status(400).json({ error: 'Email already in use' });
  }

  const updated = await StudentModel.update(id, {
    student_name,
    email,
    phone,
    password: hashedPassword,
  });

  if (!updated) {
    return res.status(404).json({ error: 'Student not found' });
  }

  return res.status(200).json(updated);
};

export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id !== req.user!.id) {
    return res.status(403).json({ error: 'You can only delete your own account' });
  }

  await RefreshTokenModel.deleteByStudentId(id);
  const student = await StudentModel.delete(id);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  return res.status(200).json({ message: 'Student deleted', student });
};
