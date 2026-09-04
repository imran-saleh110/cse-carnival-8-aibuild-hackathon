/* 
 CRUD API for class timetable records.
 All times are 24h "HH:MM", days are Sunday–Thursday.
*/
import { Request, Response } from 'express';
import { ScheduleModel } from '../models/Schedule';



// Returns all schedules, optionally filtered by course, day, room, or instructor.
// Query params are all optional — omitting them returns everything.
export const listSchedules = async (req: Request, res: Response) => {
  const { course, day, room, instructor } = req.query;

  const schedules = await ScheduleModel.findAll({
    course: course as string | undefined,
    day: day as string | undefined,
    room: room as string | undefined,
    instructor: instructor as string | undefined,
  });

  res.json(schedules);
};



// Returns a single schedule by its ID (e.g. "sch-001").
export const getSchedule = async (req: Request, res: Response) => {
  const schedule = await ScheduleModel.findById(req.params.id as string);

  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }

  res.json(schedule);
};



// Creates a new schedule. Requires: id, course, title, day, start_time, end_time, room.
// Optional: instructor, section.
export const createSchedule = async (req: Request, res: Response) => {
  const schedule = await ScheduleModel.create(req.body);
  res.status(201).json(schedule);
};



// Updates an existing schedule by ID. Only provided fields are changed (PATCH semantics).
export const updateSchedule = async (req: Request, res: Response) => {
  const schedule = await ScheduleModel.update(req.params.id as string, req.body);

  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }

  res.json(schedule);
};



// Deletes a schedule by ID. Returns the deleted record.
export const deleteSchedule = async (req: Request, res: Response) => {
  const schedule = await ScheduleModel.delete(req.params.id as string);

  if (!schedule) {
    return res.status(404).json({ error: 'Schedule not found' });
  }

  res.json({ message: 'Schedule deleted', schedule });
};
