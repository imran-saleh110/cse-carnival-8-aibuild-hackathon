import { db } from '../config/database';

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export const AGENT_TOOLS: ToolDefinition[] = [
  {
    name: 'get_schedules',
    description: 'Look up university class schedules. Can filter by day of week (Sunday, Monday, Tuesday, Wednesday, Thursday), course code (e.g. CSE 4113), or instructor name.',
    parameters: {
      type: 'object',
      properties: {
        day: {
          type: 'string',
          description: 'Day of the week (Sunday, Monday, Tuesday, Wednesday, Thursday)',
        },
        course: {
          type: 'string',
          description: 'Course code (e.g., CSE 4113, CSE 4130)',
        },
        instructor: {
          type: 'string',
          description: 'Instructor name or partial name',
        },
      },
    },
  },
  {
    name: 'search_rooms',
    description: 'Search for campus rooms (classrooms, labs, seminar rooms) by type, minimum capacity, equipment requirements (e.g. projector, whiteboard, smart board, computers), and optional time window to check availability.',
    parameters: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['classroom', 'lab', 'seminar'],
          description: 'Type of room',
        },
        min_capacity: {
          type: 'number',
          description: 'Minimum required seating capacity',
        },
        equipment: {
          type: 'string',
          description: 'Required equipment name (e.g. projector, smart board, whiteboard, computers)',
        },
        date: {
          type: 'string',
          description: 'Date to check availability for (YYYY-MM-DD)',
        },
        start_time: {
          type: 'string',
          description: 'Start time (e.g. 14:00 or 2:00 PM)',
        },
        end_time: {
          type: 'string',
          description: 'End time (e.g. 16:00 or 4:00 PM)',
        },
      },
    },
  },
  {
    name: 'book_room',
    description: 'Book an available room for a student or group. Verifies that the room is not already booked and has no scheduled class before creating the booking.',
    parameters: {
      type: 'object',
      properties: {
        room_number: {
          type: 'string',
          description: 'The room number to book (e.g., 7A02, 7B05, 302)',
        },
        date: {
          type: 'string',
          description: 'Booking date in YYYY-MM-DD format (e.g., 2026-09-05)',
        },
        start_time: {
          type: 'string',
          description: 'Start time in 24-hour HH:MM format (e.g., 15:00)',
        },
        end_time: {
          type: 'string',
          description: 'End time in 24-hour HH:MM format (e.g., 17:00)',
        },
        booked_by: {
          type: 'string',
          description: 'Name of the student or person booking the room',
        },
        purpose: {
          type: 'string',
          description: 'Purpose of the booking (e.g. Study session, Project meeting)',
        },
      },
      required: ['room_number', 'date', 'start_time', 'end_time', 'booked_by'],
    },
  },
  {
    name: 'list_events',
    description: 'Find campus events, seminars, workshops, and lectures. Can filter by status, date, or keyword search.',
    parameters: {
      type: 'object',
      properties: {
        search: {
          type: 'string',
          description: 'Keyword search for event name or description (e.g. Deep Learning, Hackathon)',
        },
        status: {
          type: 'string',
          enum: ['upcoming', 'ongoing', 'completed', 'cancelled', 'full'],
          description: 'Event status filter',
        },
        date: {
          type: 'string',
          description: 'Event start date (YYYY-MM-DD)',
        },
      },
    },
  },
  {
    name: 'register_for_event',
    description: 'Register a student for a campus event. Checks that the event exists and has remaining capacity before registering.',
    parameters: {
      type: 'object',
      properties: {
        event_name_or_id: {
          type: 'string',
          description: 'Event ID or partial event name (e.g., "Guest Lecture on Deep Learning" or "evt-002")',
        },
        student_id: {
          type: 'string',
          description: 'Student ID (e.g., "20-40532")',
        },
        student_name: {
          type: 'string',
          description: 'Student full name',
        },
      },
      required: ['event_name_or_id', 'student_id', 'student_name'],
    },
  },
  {
    name: 'list_announcements',
    description: 'Retrieve campus notices and announcements. Use this to check for room changes, rescheduled classes, deadlines, or high priority alerts.',
    parameters: {
      type: 'object',
      properties: {
        priority: {
          type: 'string',
          enum: ['high', 'medium', 'low'],
          description: 'Priority level of announcement',
        },
        active_only: {
          type: 'boolean',
          description: 'Only return active non-expired announcements (defaults to true)',
        },
        search: {
          type: 'string',
          description: 'Search term for course or topic in announcement title/body (e.g. CSE 4113, Library, Midterm)',
        },
      },
    },
  },
  {
    name: 'list_assignments',
    description: 'View academic assignments, due dates, submission platforms, and marks. Can filter by course or status.',
    parameters: {
      type: 'object',
      properties: {
        course: {
          type: 'string',
          description: 'Course code (e.g. CSE 4113, CSE 4130)',
        },
        status: {
          type: 'string',
          enum: ['pending', 'submitted', 'graded', 'late'],
          description: 'Assignment status filter',
        },
        due_before: {
          type: 'string',
          description: 'Filter assignments due on or before this date (YYYY-MM-DD)',
        },
      },
    },
  },
];

// Helper: Normalize 12h/24h time to HH:MM:00
function normalizeTime(timeStr: string): string {
  if (!timeStr) return '00:00:00';
  const clean = timeStr.trim().toLowerCase();
  const match = clean.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!match) return timeStr.length === 5 ? `${timeStr}:00` : timeStr;

  let hours = parseInt(match[1], 10);
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  const modifier = match[3];

  if (modifier === 'pm' && hours < 12) hours += 12;
  if (modifier === 'am' && hours === 12) hours = 0;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

// Helper: Get day name from date string
function getDayName(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[d.getDay()];
}

export async function executeTool(name: string, args: Record<string, any>): Promise<any> {
  switch (name) {
    case 'get_schedules': {
      let query = 'SELECT * FROM schedules';
      const conds: string[] = [];
      const vals: any[] = [];

      if (args.day) {
        vals.push(args.day);
        conds.push(`day ILIKE $${vals.length}`);
      }
      if (args.course) {
        vals.push(`%${args.course}%`);
        conds.push(`course ILIKE $${vals.length}`);
      }
      if (args.instructor) {
        vals.push(`%${args.instructor}%`);
        conds.push(`instructor ILIKE $${vals.length}`);
      }

      if (conds.length > 0) query += ' WHERE ' + conds.join(' AND ');
      query += ' ORDER BY day, start_time';

      const { rows } = await db.query(query, vals);
      return {
        count: rows.length,
        schedules: rows.map((s: any) => ({
          id: s.id,
          course: s.course,
          title: s.title,
          day: s.day,
          start_time: s.start_time,
          end_time: s.end_time,
          room: s.room,
          instructor: s.instructor,
          section: s.section,
        })),
      };
    }

    case 'search_rooms': {
      let query = 'SELECT * FROM rooms';
      const conds: string[] = [];
      const vals: any[] = [];

      if (args.type) {
        vals.push(args.type);
        conds.push(`type = $${vals.length}`);
      }
      if (args.min_capacity) {
        vals.push(args.min_capacity);
        conds.push(`capacity >= $${vals.length}`);
      }

      if (conds.length > 0) query += ' WHERE ' + conds.join(' AND ');
      query += ' ORDER BY room_number';

      const { rows } = await db.query(query, vals);
      let results = rows;

      // Equipment filter
      if (args.equipment) {
        const targetEq = args.equipment.toLowerCase();
        results = results.filter((r: any) => {
          const eqList = Array.isArray(r.equipment) ? r.equipment : [];
          return eqList.some((eq: string) => eq.toLowerCase().includes(targetEq));
        });
      }

      // Check availability if date and times provided
      if (args.date && args.start_time && args.end_time) {
        const startTime = normalizeTime(args.start_time);
        const endTime = normalizeTime(args.end_time);
        const dayOfWeek = getDayName(args.date);

        const enriched = [];
        for (const room of results) {
          // Check room bookings on that date
          const { rows: bookings } = await db.query(
            `SELECT * FROM room_bookings
             WHERE (room_id = $1 OR room_id = $2) AND date = $3
               AND NOT (end_time <= $4 OR start_time >= $5)`,
            [room.id, room.room_number, args.date, startTime, endTime]
          );

          // Check scheduled classes on that day of week
          const { rows: classes } = await db.query(
            `SELECT * FROM schedules
             WHERE room = $1 AND day ILIKE $2
               AND NOT (end_time <= $3 OR start_time >= $4)`,
            [room.room_number, dayOfWeek, startTime, endTime]
          );

          const isAvailable = bookings.length === 0 && classes.length === 0;
          enriched.push({
            room_number: room.room_number,
            type: room.type,
            capacity: room.capacity,
            floor: room.floor,
            equipment: room.equipment,
            available: isAvailable,
            conflicts: isAvailable
              ? []
              : [
                  ...bookings.map((b: any) => `Booked by ${b.booked_by} (${b.start_time}-${b.end_time})`),
                  ...classes.map((c: any) => `Class: ${c.course} (${c.start_time}-${c.end_time})`),
                ],
          });
        }
        return { count: enriched.length, rooms: enriched };
      }

      return {
        count: results.length,
        rooms: results.map((r: any) => ({
          room_number: r.room_number,
          type: r.type,
          capacity: r.capacity,
          floor: r.floor,
          status: r.status,
          equipment: r.equipment,
        })),
      };
    }

    case 'book_room': {
      const roomNum = args.room_number.trim();
      const { rows: roomRows } = await db.query(
        'SELECT * FROM rooms WHERE room_number ILIKE $1 OR id ILIKE $1',
        [roomNum]
      );

      if (!roomRows[0]) {
        return { success: false, error: `Room ${roomNum} not found on campus.` };
      }

      const room = roomRows[0];
      const startTime = normalizeTime(args.start_time);
      const endTime = normalizeTime(args.end_time);
      const dayOfWeek = getDayName(args.date);

      // Check conflicts in room_bookings
      const { rows: bookings } = await db.query(
        `SELECT * FROM room_bookings
         WHERE (room_id = $1 OR room_id = $2) AND date = $3
           AND NOT (end_time <= $4 OR start_time >= $5)`,
        [room.id, room.room_number, args.date, startTime, endTime]
      );

      if (bookings.length > 0) {
        return {
          success: false,
          error: `Room ${room.room_number} is already booked on ${args.date} between ${bookings[0].start_time} and ${bookings[0].end_time} by ${bookings[0].booked_by}.`,
        };
      }

      // Check conflicts in schedules
      const { rows: classes } = await db.query(
        `SELECT * FROM schedules
         WHERE room = $1 AND day ILIKE $2
           AND NOT (end_time <= $3 OR start_time >= $4)`,
        [room.room_number, dayOfWeek, startTime, endTime]
      );

      if (classes.length > 0) {
        return {
          success: false,
          error: `Room ${room.room_number} has a scheduled class (${classes[0].course}: ${classes[0].title}) on ${dayOfWeek} from ${classes[0].start_time} to ${classes[0].end_time}.`,
        };
      }

      const bookingId = 'bk-' + Date.now().toString(36);
      const { rows: newBookingRows } = await db.query(
        `INSERT INTO room_bookings (booking_id, room_id, booked_by, date, start_time, end_time, purpose)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [bookingId, room.id, args.booked_by, args.date, startTime, endTime, args.purpose || 'Student booking']
      );

      return {
        success: true,
        message: `Successfully booked Room ${room.room_number} on ${args.date} from ${startTime} to ${endTime} for ${args.booked_by}.`,
        booking: newBookingRows[0],
      };
    }

    case 'list_events': {
      let query = 'SELECT * FROM events';
      const conds: string[] = [];
      const vals: any[] = [];

      if (args.status) {
        vals.push(args.status);
        conds.push(`status = $${vals.length}`);
      }
      if (args.date) {
        vals.push(args.date);
        conds.push(`date = $${vals.length}`);
      }

      if (conds.length > 0) query += ' WHERE ' + conds.join(' AND ');
      query += ' ORDER BY date, start_time';

      const { rows } = await db.query(query, vals);
      let events = rows;

      if (args.search) {
        const q = args.search.toLowerCase();
        events = events.filter((e: any) =>
          e.name?.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q)
        );
      }

      return {
        count: events.length,
        events: events.map((e: any) => ({
          id: e.id,
          name: e.name,
          description: e.description,
          date: e.date,
          start_time: e.start_time,
          end_time: e.end_time,
          venue: e.venue,
          organizer: e.organizer,
          capacity: e.capacity,
          registered: e.registered,
          status: e.status,
        })),
      };
    }

    case 'register_for_event': {
      const searchStr = args.event_name_or_id.trim();
      const { rows: eventRows } = await db.query(
        'SELECT * FROM events WHERE id = $1 OR name ILIKE $2',
        [searchStr, `%${searchStr}%`]
      );

      if (!eventRows[0]) {
        return { success: false, error: `Could not find an event matching "${searchStr}".` };
      }

      const event = eventRows[0];

      // Check if already registered
      const { rows: existingRows } = await db.query(
        'SELECT * FROM event_registrations WHERE event_id = $1 AND student_id = $2',
        [event.id, args.student_id]
      );

      if (existingRows.length > 0) {
        return {
          success: false,
          error: `Student ${args.student_name} (${args.student_id}) is already registered for "${event.name}".`,
        };
      }

      // Check capacity
      if (event.registered >= event.capacity) {
        return {
          success: false,
          error: `Event "${event.name}" is already at full capacity (${event.registered}/${event.capacity}).`,
        };
      }

      // Insert registration
      await db.query(
        `INSERT INTO event_registrations (event_id, student_id, name)
         VALUES ($1, $2, $3)`,
        [event.id, args.student_id, args.student_name]
      );

      // Increment registered count
      await db.query(
        'UPDATE events SET registered = registered + 1 WHERE id = $1',
        [event.id]
      );

      return {
        success: true,
        message: `Successfully registered ${args.student_name} (${args.student_id}) for "${event.name}".`,
        event: {
          id: event.id,
          name: event.name,
          date: event.date,
          time: event.start_time,
          venue: event.venue,
        },
      };
    }

    case 'list_announcements': {
      let query = 'SELECT * FROM announcements';
      const conds: string[] = [];
      const vals: any[] = [];

      if (args.priority) {
        vals.push(args.priority);
        conds.push(`priority = $${vals.length}`);
      }

      if (conds.length > 0) query += ' WHERE ' + conds.join(' AND ');
      query += ' ORDER BY date DESC';

      const { rows } = await db.query(query, vals);
      let announcements = rows;

      if (args.search) {
        const q = args.search.toLowerCase();
        announcements = announcements.filter((a: any) =>
          a.title?.toLowerCase().includes(q) || a.body?.toLowerCase().includes(q)
        );
      }

      return {
        count: announcements.length,
        announcements: announcements.map((a: any) => ({
          id: a.id,
          title: a.title,
          body: a.body,
          date: a.date,
          priority: a.priority,
          posted_by: a.posted_by,
          expires: a.expires,
        })),
      };
    }

    case 'list_assignments': {
      let query = 'SELECT * FROM assignments';
      const conds: string[] = [];
      const vals: any[] = [];

      if (args.course) {
        vals.push(`%${args.course}%`);
        conds.push(`course ILIKE $${vals.length}`);
      }
      if (args.status) {
        vals.push(args.status);
        conds.push(`status = $${vals.length}`);
      }
      if (args.due_before) {
        vals.push(args.due_before);
        conds.push(`deadline <= $${vals.length}`);
      }

      if (conds.length > 0) query += ' WHERE ' + conds.join(' AND ');
      query += ' ORDER BY deadline ASC';

      const { rows } = await db.query(query, vals);
      return {
        count: rows.length,
        assignments: rows.map((a: any) => ({
          id: a.id,
          course: a.course,
          course_title: a.course_title,
          title: a.title,
          description: a.description,
          assigned_date: a.assigned_date,
          deadline: a.deadline,
          submission_platform: a.submission_platform,
          status: a.status,
          marks: a.marks,
        })),
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
