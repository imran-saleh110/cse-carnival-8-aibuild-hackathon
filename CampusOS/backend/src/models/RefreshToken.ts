import { db } from '../config/database';

export class RefreshTokenModel {
  static async create(studentId: string, token: string, expiresAt: Date) {
    const { rows } = await db.query(
      `INSERT INTO refresh_tokens (student_id, token, expires_at)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [studentId, token, expiresAt]
    );
    return rows[0];
  }

  static async find(token: string) {
    const { rows } = await db.query(
      'SELECT * FROM refresh_tokens WHERE token = $1',
      [token]
    );
    return rows[0] || null;
  }

  static async delete(token: string) {
    await db.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
  }

  static async deleteByStudentId(studentId: string) {
    await db.query('DELETE FROM refresh_tokens WHERE student_id = $1', [studentId]);
  }
}
