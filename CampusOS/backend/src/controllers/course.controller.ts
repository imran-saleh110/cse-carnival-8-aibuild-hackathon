import { Request, Response } from 'express';
import { CourseModel } from '../models/Course';

export const listCourses = async (req: Request, res: Response) => {
  const { department } = req.query;

  const courses = await CourseModel.findAll({
    department: department as string | undefined,
  });

  res.json(courses);
};

export const getCourse = async (req: Request, res: Response) => {
  const course = await CourseModel.findById(req.params.courseCode as string);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json(course);
};

export const createCourse = async (req: Request, res: Response) => {
  const course = await CourseModel.create(req.body);
  res.status(201).json(course);
};

export const updateCourse = async (req: Request, res: Response) => {
  const course = await CourseModel.update(req.params.courseCode as string, req.body);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json(course);
};

export const deleteCourse = async (req: Request, res: Response) => {
  const course = await CourseModel.delete(req.params.courseCode as string);

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json({ message: 'Course deleted', course });
};
