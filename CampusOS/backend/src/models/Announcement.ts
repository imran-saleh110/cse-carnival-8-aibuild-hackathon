import { db } from '../config/database';
import { CreateAnnouncementInput, UpdateAnnouncementInput, AnnouncementFilters } from '../types/announcement.types';

export class AnnouncementModel {
  static async findAll(filters: AnnouncementFilters = {}) {
    let query = 'SELECT * FROM announcements';
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.priority) {
      values.push(filters.priority);
      conditions.push(`priority = $${values.length}`);
    }
    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }
    if (filters.posted_by) {
      values.push(`%${filters.posted_by}%`);
      conditions.push(`posted_by ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY announcement_date DESC, created_at DESC';
    const { rows } = await db.query(query, values);
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await db.query('SELECT * FROM announcements WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async create(data: CreateAnnouncementInput) {
    const { rows } = await db.query(
      `INSERT INTO announcements (id, title, body, announcement_date, priority, posted_by, expires_date, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING *`,
      [data.id, data.title, data.body, data.announcement_date, data.priority, data.posted_by, data.expires_date]
    );
    return rows[0];
  }

  static async update(id: string, data: UpdateAnnouncementInput) {
    const { rows } = await db.query(
      `UPDATE announcements
       SET title              = COALESCE($1, title),
           body               = COALESCE($2, body),
           announcement_date  = COALESCE($3, announcement_date),
           priority           = COALESCE($4, priority),
           posted_by          = COALESCE($5, posted_by),
           expires_date       = COALESCE($6, expires_date),
           status             = COALESCE($7, status)
       WHERE id = $8
       RETURNING *`,
      [data.title, data.body, data.announcement_date, data.priority, data.posted_by, data.expires_date, data.status, id]
    );
    return rows[0] || null;
  }

  static async delete(id: string) {
    const { rows } = await db.query('DELETE FROM announcements WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  }
}
