import { db } from '../config/database';
import { CreateScheduleInput, UpdateScheduleInput, ScheduleFilters } from '../types/schedule.types';

export class ScheduleModel {
  static async findAll(filters: ScheduleFilters = {}) {
    let query = 'SELECT * FROM schedules';
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.course) {
      values.push(filters.course);
      conditions.push(`course = $${values.length}`);
    }
    if (filters.day) {
      values.push(filters.day);
      conditions.push(`day = $${values.length}`);
    }
    if (filters.room) {
      values.push(filters.room);
      conditions.push(`room = $${values.length}`);
    }
    if (filters.instructor) {
      values.push(`%${filters.instructor}%`);
      conditions.push(`instructor ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY day, start_time';
    const { rows } = await db.query(query, values);
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await db.query('SELECT * FROM schedules WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async create(data: CreateScheduleInput) {
    const { rows } = await db.query(
      `INSERT INTO schedules (id, course, title, day, start_time, end_time, room, instructor, section)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [data.id, data.course, data.title, data.day, data.start_time, data.end_time, data.room, data.instructor || null, data.section || null]
    );
    return rows[0];
  }

  static async update(id: string, data: UpdateScheduleInput) {
    const { rows } = await db.query(
      `UPDATE schedules
       SET course = COALESCE($1, course),
           title = COALESCE($2, title),
           day = COALESCE($3, day),
           start_time = COALESCE($4, start_time),
           end_time = COALESCE($5, end_time),
           room = COALESCE($6, room),
           instructor = COALESCE($7, instructor),
           section = COALESCE($8, section)
       WHERE id = $9
       RETURNING *`,
      [data.course, data.title, data.day, data.start_time, data.end_time, data.room, data.instructor, data.section, id]
    );
    return rows[0] || null;
  }

  static async delete(id: string) {
    const { rows } = await db.query('DELETE FROM schedules WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  }
}
