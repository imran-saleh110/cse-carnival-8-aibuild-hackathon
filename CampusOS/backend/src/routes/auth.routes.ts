import { Router } from 'express';
import { login, refresh, logout } from '../controllers/auth.controller';
import { validate, asyncHandler } from '../middleware/validation.middleware';
import { loginSchema } from '../validators/student.validator';

const router = Router();

router.post('/login', validate(loginSchema), asyncHandler(login));
router.post('/refresh', asyncHandler(refresh));
router.post('/logout', asyncHandler(logout));

export default router;
