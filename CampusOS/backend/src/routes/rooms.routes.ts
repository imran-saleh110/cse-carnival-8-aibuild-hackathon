import { Router } from 'express';
import { validate, asyncHandler } from '../middleware/validation.middleware';
import {
  createRoomSchema, updateRoomSchema, createBookingSchema, updateBookingSchema
} from '../validators/room.validator';
import {
  listRooms, getRoom, createRoom, updateRoom, deleteRoom,
  createBooking, updateBooking, deleteBooking
} from '../controllers/rooms.controller';

const router = Router();

// GET    /api/rooms                  — list all (filterable by type, status, min_capacity, floor)
// GET    /api/rooms/:id              — get one with equipment + bookings
// POST   /api/rooms                  — create new
// PUT    /api/rooms/:id              — update by ID
// DELETE /api/rooms/:id              — delete by ID (cascades equipment + bookings)
// POST   /api/rooms/bookings         — create booking (requires room_id in body)
// PUT    /api/rooms/bookings/:bookingId  — update booking
// DELETE /api/rooms/bookings/:bookingId  — delete booking

router.get('/',         asyncHandler(listRooms));
router.get('/:id',      asyncHandler(getRoom));
router.post('/',        validate(createRoomSchema),     asyncHandler(createRoom));
router.put('/:id',      validate(updateRoomSchema),     asyncHandler(updateRoom));
router.delete('/:id',   asyncHandler(deleteRoom));

router.post('/bookings',                validate(createBookingSchema),  asyncHandler(createBooking));
router.put('/bookings/:bookingId',      validate(updateBookingSchema),  asyncHandler(updateBooking));
router.delete('/bookings/:bookingId',   asyncHandler(deleteBooking));

export default router;
