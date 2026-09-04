/* CRUD API for course assignments (homework, labs, papers).*/

import { Request, Response } from 'express';
import { AssignmentModel } from '../models/Assignment';


// Sorted by deadline ascending by default.
// Returns all assignments. Filter by course or status (pending/submitted/graded/late).
export const listAssignments = async (req: Request, res: Response) => {
  const { course, status } = req.query;

  const assignments = await AssignmentModel.findAll({
    course: course as string | undefined,
    status: status as string | undefined,
  });

  res.json(assignments);
};



// Returns a single assignment by ID.
export const getAssignment = async (req: Request, res: Response) => {
  const asgn = await AssignmentModel.findById(req.params.id as string);

  if (!asgn) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  res.json(asgn);
};



// Creates a new assignment. Requires: id, course, course_title, title,
// assigned_date, deadline.
// Optional: description, submission_platform, status (defaults to "pending"), marks.
export const createAssignment = async (req: Request, res: Response) => {
  const asgn = await AssignmentModel.create(req.body);
  res.status(201).json(asgn);
};



// Updates an assignment by ID. Only provided fields are changed.
export const updateAssignment = async (req: Request, res: Response) => {
  const asgn = await AssignmentModel.update(req.params.id as string, req.body);

  if (!asgn) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  res.json(asgn);
};



// Deletes an assignment by ID.
export const deleteAssignment = async (req: Request, res: Response) => {
  const asgn = await AssignmentModel.delete(req.params.id as string);

  if (!asgn) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  res.json({ message: 'Assignment deleted', assignment: asgn });
};
