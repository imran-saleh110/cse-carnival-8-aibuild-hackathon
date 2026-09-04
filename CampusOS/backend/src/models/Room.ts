import { db } from '../config/database';
import { CreateRoomInput, UpdateRoomInput, RoomFilters, CreateBookingInput, UpdateBookingInput } from '../types/room.types';

export class RoomModel {
  static async findAll(filters: RoomFilters = {}) {
    let query = 'SELECT * FROM rooms';
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.type) {
      values.push(filters.type);
      conditions.push(`type = $${values.length}`);
    }
    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }
    if (filters.min_capacity) {
      values.push(filters.min_capacity);
      conditions.push(`capacity >= $${values.length}`);
    }
    if (filters.floor) {
      values.push(filters.floor);
      conditions.push(`floor = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY room_number';

    const { rows: rooms } = await db.query(query, values);

    // Attach equipment to each room
    for (const room of rooms) {
      const { rows: eq } = await db.query(
        'SELECT equipment FROM room_equipment WHERE room_id = $1 ORDER BY equipment',
        [room.id]
      );
      room.equipment = eq.map((e: any) => e.equipment);
    }

    return rooms;
  }

  static async findById(id: string) {
    const { rows } = await db.query('SELECT * FROM rooms WHERE id = $1', [id]);
    if (!rows[0]) return null;

    const room = rows[0];

    const { rows: eq } = await db.query(
      'SELECT equipment FROM room_equipment WHERE room_id = $1 ORDER BY equipment',
      [id]
    );
    room.equipment = eq.map((e: any) => e.equipment);

    const { rows: bookings } = await db.query(
      'SELECT * FROM room_bookings WHERE room_id = $1 ORDER BY booking_date, start_time',
      [id]
    );
    room.bookings = bookings;

    return room;
  }

  static async create(data: CreateRoomInput) {
    const { rows } = await db.query(
      `INSERT INTO rooms (id, room_number, type, capacity, floor, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.id, data.room_number, data.type, data.capacity, data.floor, data.status || 'available']
    );

    const room = rows[0];

    if (data.equipment?.length) {
      for (const eq of data.equipment) {
        await db.query(
          'INSERT INTO room_equipment (room_id, equipment) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [room.id, eq]
        );
      }
    }

    room.equipment = data.equipment || [];
    return room;
  }

  static async update(id: string, data: UpdateRoomInput) {
    const { rows } = await db.query(
      `UPDATE rooms
       SET room_number = COALESCE($1, room_number),
           type        = COALESCE($2, type),
           capacity    = COALESCE($3, capacity),
           floor       = COALESCE($4, floor),
           status      = COALESCE($5, status)
       WHERE id = $6
       RETURNING *`,
      [data.room_number, data.type, data.capacity, data.floor, data.status, id]
    );

    if (!rows[0]) return null;

    const room = rows[0];

    if (data.equipment) {
      await db.query('DELETE FROM room_equipment WHERE room_id = $1', [id]);
      for (const eq of data.equipment) {
        await db.query(
          'INSERT INTO room_equipment (room_id, equipment) VALUES ($1, $2) ON CONFLICT DO NOTHING',
          [id, eq]
        );
      }
    }

    const { rows: eq } = await db.query(
      'SELECT equipment FROM room_equipment WHERE room_id = $1',
      [id]
    );
    room.equipment = eq.map((e: any) => e.equipment);

    return room;
  }

  static async delete(id: string) {
    const { rows } = await db.query('DELETE FROM rooms WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  }

  // ── bookings ──────────────────────────────────────
  static async findBooking(bookingId: string) {
    const { rows } = await db.query('SELECT * FROM room_bookings WHERE booking_id = $1', [bookingId]);
    return rows[0] || null;
  }

  static async createBooking(data: CreateBookingInput) {
    const { rows } = await db.query(
      `INSERT INTO room_bookings (booking_id, room_id, booked_by, booking_date, start_time, end_time, purpose, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING *`,
      [data.booking_id, data.room_id, data.booked_by, data.booking_date, data.start_time, data.end_time, data.purpose || '']
    );
    return rows[0];
  }

  static async updateBooking(bookingId: string, data: UpdateBookingInput) {
    const { rows } = await db.query(
      `UPDATE room_bookings
       SET booked_by     = COALESCE($1, booked_by),
           booking_date  = COALESCE($2, booking_date),
           start_time    = COALESCE($3, start_time),
           end_time      = COALESCE($4, end_time),
           purpose       = COALESCE($5, purpose),
           status        = COALESCE($6, status)
       WHERE booking_id = $7
       RETURNING *`,
      [data.booked_by, data.booking_date, data.start_time, data.end_time, data.purpose, data.status, bookingId]
    );
    return rows[0] || null;
  }

  static async deleteBooking(bookingId: string) {
    const { rows } = await db.query('DELETE FROM room_bookings WHERE booking_id = $1 RETURNING *', [bookingId]);
    return rows[0] || null;
  }
}
