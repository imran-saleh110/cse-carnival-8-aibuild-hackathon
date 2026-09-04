/* 
 CRUD API for campus rooms (classrooms, labs, seminar halls).
 Each room has equipment (string array) and bookings (sub-resource).
*/

import { Request, Response } from 'express';
import { RoomModel } from '../models/Room';



// Returns all rooms with their equipment lists.
// Filter by type (classroom/lab/seminar), status (available/unavailable),
// min_capacity, or floor.
export const listRooms = async (req: Request, res: Response) => {
  const { type, status, min_capacity, floor } = req.query;

  const rooms = await RoomModel.findAll({
    type: type as string | undefined,
    status: status as string | undefined,
    min_capacity: min_capacity ? parseInt(min_capacity as string) : undefined,
    floor: floor ? parseInt(floor as string) : undefined,
  });

  res.json(rooms);
};



// Returns a single room with its equipment and all bookings.
export const getRoom = async (req: Request, res: Response) => {
  const room = await RoomModel.findById(req.params.id as string);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json(room);
};



// Creates a new room. Requires: id, room_number, type, capacity, floor.
// Optional: status (defaults to "available"), equipment (string array).
export const createRoom = async (req: Request, res: Response) => {
  const room = await RoomModel.create(req.body);
  res.status(201).json(room);
};



// Updates an existing room by ID. Only provided fields are changed.
export const updateRoom = async (req: Request, res: Response) => {
  const room = await RoomModel.update(req.params.id as string, req.body);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json(room);
};



// Deletes a room by ID. Cascades to equipment and bookings.
export const deleteRoom = async (req: Request, res: Response) => {
  const room = await RoomModel.delete(req.params.id as string);

  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  res.json({ message: 'Room deleted', room });
};




// ─── ROOM BOOKINGS ──────────────────────────────────
// Sub-resource of rooms. A booking ties a person to a room at a specific time.




// Creates a new booking. Requires: booking_id, room_id, booked_by, booking_date, start_time, end_time.
// The room must exist. Status defaults to "active".
export const createBooking = async (req: Request, res: Response) => {
  const { room_id } = req.body;

  const room = await RoomModel.findById(room_id);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }

  const booking = await RoomModel.createBooking(req.body);
  res.status(201).json(booking);
};



// Updates a booking by booking_id. Can change times, purpose, or status.
export const updateBooking = async (req: Request, res: Response) => {
  const booking = await RoomModel.updateBooking(req.params.bookingId as string, req.body);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json(booking);
};



// Deletes a booking by booking_id.
export const deleteBooking = async (req: Request, res: Response) => {
  const booking = await RoomModel.deleteBooking(req.params.bookingId as string);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json({ message: 'Booking deleted', booking });
};
