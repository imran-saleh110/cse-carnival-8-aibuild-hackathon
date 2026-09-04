/* 
  CRUD API for campus events (hackathons, lectures, workshops, etc.).
  Each event has registrations (sub-resource) and a capacity limit.
*/

import { Request, Response } from 'express';
import { EventModel } from '../models/Event';



// Returns all events. Filter by status, venue, organizer, or date.
export const listEvents = async (req: Request, res: Response) => {
  const { status, venue, organizer, date } = req.query;

  const events = await EventModel.findAll({
    status: status as string | undefined,
    venue: venue as string | undefined,
    organizer: organizer as string | undefined,
    date: date as string | undefined,
  });

  res.json(events);
};



// Returns a single event with all its registrations.
export const getEvent = async (req: Request, res: Response) => {
  const event = await EventModel.findById(req.params.id as string);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(event);
};



// Creates a new event. Requires: id, name, start_date, start_time, end_time,
// end_date, venue, organizer, capacity.
// Optional: description, registered (defaults to 0), status (defaults to "upcoming").
export const createEvent = async (req: Request, res: Response) => {
  const event = await EventModel.create(req.body);
  res.status(201).json(event);
};



// Updates an event by ID. Only provided fields are changed.
export const updateEvent = async (req: Request, res: Response) => {
  const event = await EventModel.update(req.params.id as string, req.body);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json(event);
};



// Deletes an event by ID. Cascades to registrations.
export const deleteEvent = async (req: Request, res: Response) => {
  const event = await EventModel.delete(req.params.id as string);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  res.json({ message: 'Event deleted', event });
};



// ─── EVENT REGISTRATIONS ────────────────────────────
// Sub-resource of events. Registers a student for an event.



// Registers a student for an event.
// Checks: event exists, student not already registered, event not full.
// Automatically increments the event's registered count.
export const registerForEvent = async (req: Request, res: Response) => {
  const eventId = req.params.id as string;
  const { student_id, student_name } = req.body;

  const event = await EventModel.findById(eventId);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const existing = await EventModel.findRegistration(eventId, student_id);
  if (existing) {
    return res.status(409).json({ error: 'Student already registered for this event' });
  }

  if (event.registered >= event.capacity) {
    return res.status(400).json({ error: 'Event is full' });
  }

  const reg = await EventModel.addRegistration({ event_id: eventId, student_id, student_name });
  res.status(201).json(reg);
};



// Removes a student's registration from an event.
// Decrements the event's registered count.
export const unregisterFromEvent = async (req: Request, res: Response) => {
  const reg = await EventModel.removeRegistration(
    req.params.id as string,
    req.params.studentId as string
  );

  if (!reg) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  res.json({ message: 'Registration removed', registration: reg });
};
