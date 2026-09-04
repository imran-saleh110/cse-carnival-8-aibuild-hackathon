import { Router } from 'express';
import { verifyToken } from '../middleware/verifyToken';
import { validate, asyncHandler } from '../middleware/validation.middleware';
import { createStudentSchema, updateStudentSchema } from '../validators/student.validator';
import {
  getAllStudents,
  getProfile,
  createStudent,
  updateStudent,
  deleteStudent,
} from '../controllers/student.controller';

const router = Router();

router.get('/', asyncHandler(getAllStudents));
router.get('/profile', verifyToken, asyncHandler(getProfile));
router.post('/', validate(createStudentSchema), asyncHandler(createStudent));
router.put('/:id', verifyToken, validate(updateStudentSchema), asyncHandler(updateStudent));
router.delete('/:id', verifyToken, asyncHandler(deleteStudent));

export default router;
