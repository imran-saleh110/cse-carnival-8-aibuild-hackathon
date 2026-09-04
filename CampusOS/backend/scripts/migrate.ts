import { db } from '../src/config/database';

const SCHEMA = `
-- ========================================
-- update_updated_at_column() trigger func
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============
-- SCHEDULES
-- ============
CREATE TABLE IF NOT EXISTS schedules (
  id VARCHAR(50) PRIMARY KEY,
  course VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  day VARCHAR(20) NOT NULL CHECK (day IN ('Sunday','Monday','Tuesday','Wednesday','Thursday')),
  start_time TIME NOT NULL,
  end_time   TIME NOT NULL,
  room VARCHAR(50) NOT NULL,
  instructor VARCHAR(255),
  section VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_schedules_course    ON schedules(course);
CREATE INDEX IF NOT EXISTS idx_schedules_day       ON schedules(day);
CREATE INDEX IF NOT EXISTS idx_schedules_room      ON schedules(room);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_schedules_updated_at') THEN
    CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ============
-- ROOMS
-- ============
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(50) PRIMARY KEY,
  room_number VARCHAR(20) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('classroom','lab','seminar')),
  capacity INT NOT NULL CHECK (capacity > 0),
  floor INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available','unavailable')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rooms_type   ON rooms(type);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_rooms_updated_at') THEN
    CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON rooms
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ==================
-- ROOM EQUIPMENT
-- ==================
CREATE TABLE IF NOT EXISTS room_equipment (
  room_id VARCHAR(50) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  equipment VARCHAR(100) NOT NULL,
  PRIMARY KEY (room_id, equipment)
);

-- ==============
-- ROOM BOOKINGS
-- ==============
CREATE TABLE IF NOT EXISTS room_bookings (
  booking_id VARCHAR(50) PRIMARY KEY,
  room_id VARCHAR(50) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  booked_by VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  purpose VARCHAR(255) DEFAULT '',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active','cancelled','completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_room_bookings_room_id ON room_bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_room_bookings_date    ON room_bookings(booking_date);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_room_bookings_updated_at') THEN
    CREATE TRIGGER update_room_bookings_updated_at BEFORE UPDATE ON room_bookings
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ===========
-- EVENTS
-- ===========
CREATE TABLE IF NOT EXISTS events (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  start_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  end_date DATE NOT NULL,
  venue VARCHAR(50) NOT NULL,
  organizer VARCHAR(255) NOT NULL,
  capacity INT NOT NULL CHECK (capacity > 0),
  registered INT NOT NULL DEFAULT 0 CHECK (registered >= 0),
  status VARCHAR(20) DEFAULT 'upcoming' CHECK (status IN ('upcoming','ongoing','completed','cancelled','full')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_status      ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_start_date  ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_venue       ON events(venue);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_events_updated_at') THEN
    CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =====================
-- EVENT REGISTRATIONS
-- =====================
CREATE TABLE IF NOT EXISTS event_registrations (
  event_id VARCHAR(50) NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  student_id VARCHAR(50) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (event_id, student_id)
);

-- =================
-- ANNOUNCEMENTS
-- =================
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  date DATE NOT NULL,
  priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  posted_by VARCHAR(255) NOT NULL,
  expires_date DATE NOT NULL,
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active','expired')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_announcements_priority ON announcements(priority);
CREATE INDEX IF NOT EXISTS idx_announcements_status   ON announcements(status);
CREATE INDEX IF NOT EXISTS idx_announcements_expires  ON announcements(expires_date);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_announcements_updated_at') THEN
    CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- =============
-- ASSIGNMENTS
-- =============
CREATE TABLE IF NOT EXISTS assignments (
  id VARCHAR(50) PRIMARY KEY,
  course VARCHAR(50) NOT NULL,
  course_title VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  assigned_date DATE NOT NULL,
  deadline DATE NOT NULL,
  submission_platform VARCHAR(255) DEFAULT '',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','submitted','graded','late')),
  marks INT DEFAULT 0 CHECK (marks >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assignments_course    ON assignments(course);
CREATE INDEX IF NOT EXISTS idx_assignments_status    ON assignments(status);
CREATE INDEX IF NOT EXISTS idx_assignments_deadline  ON assignments(deadline);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_assignments_updated_at') THEN
    CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ===========
-- STUDENTS
-- ===========
CREATE TABLE IF NOT EXISTS students (
  student_id VARCHAR(50) PRIMARY KEY,
  student_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_students_name ON students(student_name);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_students_updated_at') THEN
    CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ===========
-- COURSES
-- ===========
CREATE TABLE IF NOT EXISTS courses (
  course_code VARCHAR(50) PRIMARY KEY,
  course_title VARCHAR(255) NOT NULL,
  department VARCHAR(100),
  credits INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_courses_department ON courses(department);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_courses_updated_at') THEN
    CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- ===============
-- REFRESH TOKENS
-- ===============
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id SERIAL PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_student ON refresh_tokens(student_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token   ON refresh_tokens(token);
`;

async function migrate() {
  try {
    await db.query(SCHEMA);
    console.log('Migration completed successfully — all 5 systems created.');
  } catch (err: any) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await db.pool.end();
  }
}

migrate();
