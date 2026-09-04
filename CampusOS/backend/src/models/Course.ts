import { db } from '../config/database';
import { CreateCourseInput, UpdateCourseInput, CourseFilters } from '../types/course.types';

export class CourseModel {
  static async findAll(filters: CourseFilters = {}) {
    let query = 'SELECT * FROM courses';
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (filters.department) {
      values.push(`%${filters.department}%`);
      conditions.push(`department ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY course_code';
    const { rows } = await db.query(query, values);
    return rows;
  }

  static async findById(courseCode: string) {
    const { rows } = await db.query(
      'SELECT * FROM courses WHERE course_code = $1',
      [courseCode]
    );
    return rows[0] || null;
  }

  static async create(data: CreateCourseInput) {
    const { rows } = await db.query(
      `INSERT INTO courses (course_code, course_title, department, credits)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.course_code, data.course_title, data.department || null, data.credits || null]
    );
    return rows[0];
  }

  static async update(courseCode: string, data: UpdateCourseInput) {
    const { rows } = await db.query(
      `UPDATE courses
       SET course_title = COALESCE($1, course_title),
           department = COALESCE($2, department),
           credits = COALESCE($3, credits)
       WHERE course_code = $4
       RETURNING *`,
      [data.course_title, data.department, data.credits, courseCode]
    );
    return rows[0] || null;
  }

  static async delete(courseCode: string) {
    const { rows } = await db.query(
      'DELETE FROM courses WHERE course_code = $1 RETURNING *',
      [courseCode]
    );
    return rows[0] || null;
  }
}
