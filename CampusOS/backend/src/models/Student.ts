import { db } from '../config/database';
import { CreateStudentInput, UpdateStudentInput } from '../types/student.types';

export class StudentModel {
  static async findAll() {
    const { rows } = await db.query(
      'SELECT student_id, student_name, email, phone, created_at, updated_at FROM students ORDER BY created_at DESC'
    );
    return rows;
  }

  static async findById(id: string) {
    const { rows } = await db.query(
      'SELECT student_id, student_name, email, phone, created_at, updated_at FROM students WHERE student_id = $1',
      [id]
    );
    return rows[0] || null;
  }

  static async findByEmail(email: string) {
    const { rows } = await db.query('SELECT * FROM students WHERE email = $1', [email]);
    return rows[0] || null;
  }

  static async create(data: CreateStudentInput) {
    const { rows } = await db.query(
      `INSERT INTO students (student_id, student_name, email, phone, password)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING student_id, student_name, email, phone, created_at, updated_at`,
      [data.student_id, data.student_name, data.email, data.phone || null, data.password]
    );
    return rows[0];
  }

  static async update(id: string, data: UpdateStudentInput) {
    const { rows } = await db.query(
      `UPDATE students
       SET student_name = COALESCE($1, student_name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone),
           password = COALESCE($4, password)
       WHERE student_id = $5
       RETURNING student_id, student_name, email, phone, created_at, updated_at`,
      [data.student_name, data.email, data.phone, data.password, id]
    );
    return rows[0] || null;
  }

  static async delete(id: string) {
    const { rows } = await db.query(
      'DELETE FROM students WHERE student_id = $1 RETURNING student_id, student_name, email',
      [id]
    );
    return rows[0] || null;
  }
}
