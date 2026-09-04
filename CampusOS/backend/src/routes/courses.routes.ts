import { Router } from 'express';
import { validate, asyncHandler } from '../middleware/validation.middleware';
import { createCourseSchema, updateCourseSchema } from '../validators/course.validator';
import {
  listCourses, getCourse, createCourse, updateCourse, deleteCourse
} from '../controllers/course.controller';

const router = Router();

router.get('/', asyncHandler(listCourses));
router.get('/:courseCode', asyncHandler(getCourse));
router.post('/', validate(createCourseSchema), asyncHandler(createCourse));
router.put('/:courseCode', validate(updateCourseSchema), asyncHandler(updateCourse));
router.delete('/:courseCode', asyncHandler(deleteCourse));

export default router;
