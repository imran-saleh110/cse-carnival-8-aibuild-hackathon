import { Router } from 'express';
import { RoomController } from '../controllers/rooms.controller';
import { validate } from '../middleware/validation.middleware';
import { createRoomSchema, updateRoomSchema, createBookingSchema, updateBookingSchema } from '../validators/room.validator';

const router = Router();

router.get('/', RoomController.list);
router.get('/:id', RoomController.getById);
router.post('/', validate(createRoomSchema), RoomController.create);
router.put('/:id', validate(updateRoomSchema), RoomController.update);
router.delete('/:id', RoomController.remove);

router.post('/bookings', validate(createBookingSchema), RoomController.createBooking);
router.put('/bookings/:bookingId', validate(updateBookingSchema), RoomController.updateBooking);
router.delete('/bookings/:bookingId', RoomController.removeBooking);

export default router;
