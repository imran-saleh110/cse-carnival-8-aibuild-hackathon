import { db } from '../src/config/database';
import fs from 'fs';
import path from 'path';

async function seed() {
  try {
    const filePath = path.resolve(__dirname, '../../../data/schedules.json');
    const raw = fs.readFileSync(filePath, 'utf-8');
    const schedules = JSON.parse(raw);

    for (const s of schedules) {
      await db.query(
        `INSERT INTO schedules (id, course, title, day, start_time, end_time, room, instructor, section)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO UPDATE SET
           course = EXCLUDED.course,
           title = EXCLUDED.title,
           day = EXCLUDED.day,
           start_time = EXCLUDED.start_time,
           end_time = EXCLUDED.end_time,
           room = EXCLUDED.room,
           instructor = EXCLUDED.instructor,
           section = EXCLUDED.section,
           updated_at = CURRENT_TIMESTAMP`,
        [s.id, s.course, s.title, s.day, s.start_time, s.end_time, s.room, s.instructor, s.section]
      );
    }

    console.log(`Seeded ${schedules.length} schedules.`);
  } catch (err: any) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

seed();
