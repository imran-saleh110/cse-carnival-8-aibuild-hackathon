import { db } from '../config/database';
import { CreateAssignmentInput, UpdateAssignmentInput, AssignmentFilters } from '../types/assignment.types';

export class AssignmentModel {
  static async findAll(filters: AssignmentFilters = {}) {
    let query = 'SELECT * FROM assignments';
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.course) {
      values.push(filters.course);
      conditions.push(`course = $${values.length}`);
    }
    if (filters.status) {
      values.push(filters.status);
      conditions.push(`status = $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY deadline ASC';
    const { rows } = await db.query(query, values);
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await db.query('SELECT * FROM assignments WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async create(data: CreateAssignmentInput) {
    const { rows } = await db.query(
      `INSERT INTO assignments (id, course, course_title, title, description,
                                assigned_date, deadline, submission_platform, status, marks)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [data.id, data.course, data.course_title, data.title, data.description || '',
       data.assigned_date, data.deadline, data.submission_platform || '', data.status || 'pending', data.marks || 0]
    );
    return rows[0];
  }

  static async update(id: string, data: UpdateAssignmentInput) {
    const { rows } = await db.query(
      `UPDATE assignments
       SET course              = COALESCE($1, course),
           course_title        = COALESCE($2, course_title),
           title               = COALESCE($3, title),
           description         = COALESCE($4, description),
           assigned_date       = COALESCE($5, assigned_date),
           deadline            = COALESCE($6, deadline),
           submission_platform = COALESCE($7, submission_platform),
           status              = COALESCE($8, status),
           marks               = COALESCE($9, marks)
       WHERE id = $10
       RETURNING *`,
      [data.course, data.course_title, data.title, data.description,
       data.assigned_date, data.deadline, data.submission_platform, data.status, data.marks, id]
    );
    return rows[0] || null;
  }

  static async delete(id: string) {
    const { rows } = await db.query('DELETE FROM assignments WHERE id = $1 RETURNING *', [id]);
    return rows[0] || null;
  }
}
