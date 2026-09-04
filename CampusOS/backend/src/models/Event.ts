import { db } from '../config/database';
import { CreateEventInput, UpdateEventInput, EventFilters, CreateRegistrationInput } from '../types/event.types';

export class EventModel {
  static async findAll(filters: EventFilters = {}) {
    let query = 'SELECT * FROM events';
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }
    if (filters.venue) {
      values.push(filters.venue);
      conditions.push(`venue = $${values.length}`);
    }
    if (filters.organizer) {
      values.push(`%${filters.organizer}%`);
      conditions.push(`organizer ILIKE $${values.length}`);
    }
    if (filters.date) {
      values.push(filters.date);
      conditions.push(`start_date = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY start_date, start_time';
    const { rows } = await db.query(query, values);
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (!rows[0]) return null;

    const event = rows[0];

    const { rows: regs } = await db.query(
      'SELECT * FROM event_registrations WHERE event_id = $1 ORDER BY student_id',
      [id]
    );
    event.registrations = regs;

    return event;
  }

  static async create(data: CreateEventInput) {
    const { rows } = await db.query(
      `INSERT INTO events (id, name, description, start_date, start_time, end_time, end_date,
                           venue, organizer, capacity, registered, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [data.id, data.name, data.description || '', data.start_date, data.start_time,
       data.end_time, data.end_date, data.venue, data.organizer,
       data.capacity, data.registered || 0, data.status || 'upcoming']
    );
    return { ...rows[0], registrations: [] };
  }

  static async update(id: string, data: UpdateEventInput) {
    const { rows } = await db.query(
      `UPDATE events
       SET name        = COALESCE($1, name),
           description = COALESCE($2, description),
           start_date  = COALESCE($3, start_date),
           start_time  = COALESCE($4, start_time),
           end_time    = COALESCE($5, end_time),
           end_date    = COALESCE($6, end_date),
           venue       = COALESCE($7, venue),
           organizer   = COALESCE($8, organizer),
           capacity    = COALESCE($9, capacity),
           registered  = COALESCE($10, registered),
           status      = COALESCE($11, status)
       WHERE id = $12
       RETURNING *`,
      [data.name, data.description, data.start_date, data.start_time,
       data.end_time, data.end_date, data.venue, data.organizer,
       data.capacity, data.registered, data.status, id]
    );
    return rows[0] || null;
  }

  static async delete(id: string) {
    const { rows } = await db.query('DELETE FROM events WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  }

  // ── registrations ─────────────────────────────────
  static async findRegistration(eventId: string, studentId: string) {
    const { rows } = await db.query(
      'SELECT * FROM event_registrations WHERE event_id = $1 AND student_id = $2',
      [eventId, studentId]
    );
    return rows[0] || null;
  }

  static async addRegistration(data: CreateRegistrationInput) {
    const { rows } = await db.query(
      `INSERT INTO event_registrations (event_id, student_id, student_name)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [data.event_id, data.student_id, data.student_name]
    );

    // Increment registered count
    await db.query(
      'UPDATE events SET registered = registered + 1 WHERE id = $1',
      [data.event_id]
    );

    return rows[0];
  }

  static async removeRegistration(eventId: string, studentId: string) {
    const { rows } = await db.query(
      'DELETE FROM event_registrations WHERE event_id = $1 AND student_id = $2 RETURNING *',
      [eventId, studentId]
    );

    if (rows[0]) {
      await db.query(
        'UPDATE events SET registered = GREATEST(registered - 1, 0) WHERE id = $1',
        [eventId]
      );
    }

    return rows[0] || null;
  }
}
