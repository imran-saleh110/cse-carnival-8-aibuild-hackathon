import { db } from '../src/config/database';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(__dirname, '../../../data');

function readJson<T>(filename: string): T {
  const raw = fs.readFileSync(path.join(DATA_DIR, filename), 'utf-8');
  return JSON.parse(raw) as T;
}

// ── schedules ──────────────────────────────────────
async function seedSchedules() {
  console.log('Seeding schedules...');
  const rows: any[] = readJson('schedules.json');

  for (const s of rows) {
    await db.query(
      `INSERT INTO schedules (id, course, title, day, start_time, end_time, room, instructor, section)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET
         course=EXCLUDED.course, title=EXCLUDED.title, day=EXCLUDED.day,
         start_time=EXCLUDED.start_time, end_time=EXCLUDED.end_time, room=EXCLUDED.room,
         instructor=EXCLUDED.instructor, section=EXCLUDED.section, updated_at=CURRENT_TIMESTAMP`,
      [s.id, s.course, s.title, s.day, s.start_time, s.end_time, s.room, s.instructor, s.section]
    );
  }

  console.log(`  ${rows.length} schedules`);
}

// ── rooms + equipment + bookings ───────────────────
async function seedRooms() {
  console.log('Seeding rooms...');
  const rows: any[] = readJson('rooms.json');

  for (const r of rows) {
    await db.query(
      `INSERT INTO rooms (id, room_number, type, capacity, floor, status)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET
         type=EXCLUDED.type, capacity=EXCLUDED.capacity,
         floor=EXCLUDED.floor, status=EXCLUDED.status, updated_at=CURRENT_TIMESTAMP`,
      [r.id, r.room_number, r.type, r.capacity, r.floor, r.status]
    );

    for (const eq of (r.equipment ?? []) as string[]) {
      await db.query(
        `INSERT INTO room_equipment (room_id, equipment)
         VALUES ($1,$2)
         ON CONFLICT (room_id, equipment) DO NOTHING`,
        [r.id, eq]
      );
    }

    for (const b of (r.bookings ?? []) as any[]) {
      await db.query(
        `INSERT INTO room_bookings (booking_id, room_id, booked_by, booking_date, start_time, end_time, purpose, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,'active')
         ON CONFLICT (booking_id) DO UPDATE SET
           booked_by=EXCLUDED.booked_by, booking_date=EXCLUDED.booking_date,
           start_time=EXCLUDED.start_time, end_time=EXCLUDED.end_time,
           purpose=EXCLUDED.purpose, updated_at=CURRENT_TIMESTAMP`,
        [b.booking_id, r.id, b.booked_by, b.date, b.start_time, b.end_time, b.purpose ?? '']
      );
    }
  }

  console.log(`  ${rows.length} rooms`);
}

// ── events + registrations ─────────────────────────
async function seedEvents() {
  console.log('Seeding events...');
  const rows: any[] = readJson('events.json');

  for (const e of rows) {
    await db.query(
      `INSERT INTO events (id, name, description, start_date, start_time, end_time, end_date,
                           venue, organizer, capacity, registered, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO UPDATE SET
         name=EXCLUDED.name, description=EXCLUDED.description,
         start_date=EXCLUDED.start_date, start_time=EXCLUDED.start_time,
         end_time=EXCLUDED.end_time, end_date=EXCLUDED.end_date,
         venue=EXCLUDED.venue, organizer=EXCLUDED.organizer,
         capacity=EXCLUDED.capacity, registered=EXCLUDED.registered,
         status=EXCLUDED.status, updated_at=CURRENT_TIMESTAMP`,
      [e.id, e.name, e.description ?? '', e.date, e.start_time, e.end_time, e.end_date,
       e.venue, e.organizer, e.capacity, e.registered, e.status]
    );

    for (const reg of (e.registrations ?? []) as any[]) {
      await db.query(
        `INSERT INTO event_registrations (event_id, student_id, student_name)
         VALUES ($1,$2,$3)
         ON CONFLICT (event_id, student_id) DO NOTHING`,
        [e.id, reg.student_id, reg.name]
      );
    }
  }

  console.log(`  ${rows.length} events`);
}

// ── announcements ──────────────────────────────────
async function seedAnnouncements() {
  console.log('Seeding announcements...');
  const rows: any[] = readJson('announcements.json');
  const now = new Date().toISOString().slice(0, 10);

  for (const a of rows) {
    const status = a.expires < now ? 'expired' : 'active';

    await db.query(
      `INSERT INTO announcements (id, title, body, announcement_date, priority, posted_by, expires_date, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET
         title=EXCLUDED.title, body=EXCLUDED.body,
         announcement_date=EXCLUDED.announcement_date, priority=EXCLUDED.priority,
         posted_by=EXCLUDED.posted_by, expires_date=EXCLUDED.expires_date,
         status=EXCLUDED.status, updated_at=CURRENT_TIMESTAMP`,
      [a.id, a.title, a.body, a.date, a.priority, a.posted_by, a.expires, status]
    );
  }

  console.log(`  ${rows.length} announcements`);
}

// ── assignments ────────────────────────────────────
async function seedAssignments() {
  console.log('Seeding assignments...');
  const rows: any[] = readJson('assignments.json');

  for (const a of rows) {
    await db.query(
      `INSERT INTO assignments (id, course, course_title, title, description,
                                assigned_date, deadline, submission_platform, status, marks)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET
         course=EXCLUDED.course, course_title=EXCLUDED.course_title,
         title=EXCLUDED.title, description=EXCLUDED.description,
         assigned_date=EXCLUDED.assigned_date, deadline=EXCLUDED.deadline,
         submission_platform=EXCLUDED.submission_platform,
         status=EXCLUDED.status, marks=EXCLUDED.marks, updated_at=CURRENT_TIMESTAMP`,
      [a.id, a.course, a.course_title, a.title, a.description ?? '',
       a.assigned_date, a.deadline, a.submission_platform ?? '', a.status, a.marks ?? 0]
    );
  }

  console.log(`  ${rows.length} assignments`);
}

// ── main ───────────────────────────────────────────
async function seed() {
  try {
    console.log('Starting CampusOS seeding...\n');
    await seedSchedules();
    await seedRooms();
    await seedEvents();
    await seedAnnouncements();
    await seedAssignments();
    console.log('\nSeeding complete.');
  } catch (err: any) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

seed();
