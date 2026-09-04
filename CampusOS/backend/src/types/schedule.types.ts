export interface Schedule {
  id: string;
  course: string;
  title: string;
  day: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday';
  start_time: string;
  end_time: string;
  room: string;
  instructor: string | null;
  section: string | null;
  created_at: Date;
  updated_at: Date;
}

// Optional query filters for GET /api/schedules
export interface ScheduleFilters {
  course?: string;
  day?: string;
  room?: string;
  instructor?: string;
}

// Body types for POST /api/schedules and PUT /api/schedules/:id
export interface CreateScheduleInput {
  id: string;
  course: string;
  title: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  instructor?: string;
  section?: string;
}

export type UpdateScheduleInput = Partial<CreateScheduleInput>;
