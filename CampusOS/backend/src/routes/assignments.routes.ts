import { Router } from 'express';
import { validate, asyncHandler } from '../middleware/validation.middleware';
import { createAssignmentSchema, updateAssignmentSchema } from '../validators/assignment.validator';
import {
  listAssignments, getAssignment, createAssignment, updateAssignment, deleteAssignment
} from '../controllers/assignments.controller';

const router = Router();

// GET    /api/assignments          — list all (filterable by course, status)
// GET    /api/assignments/:id      — get one by ID
// POST   /api/assignments          — create new
// PUT    /api/assignments/:id      — update by ID
// DELETE /api/assignments/:id      — delete by ID

router.get('/',     asyncHandler(listAssignments));
router.get('/:id',  asyncHandler(getAssignment));
router.post('/',    validate(createAssignmentSchema),  asyncHandler(createAssignment));
router.put('/:id',  validate(updateAssignmentSchema),  asyncHandler(updateAssignment));
router.delete('/:id', asyncHandler(deleteAssignment));

export default router;
