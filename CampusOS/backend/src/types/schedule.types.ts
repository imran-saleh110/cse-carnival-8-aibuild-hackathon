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

export interface UpdateScheduleInput {
  course?: string;
  title?: string;
  day?: string;
  start_time?: string;
  end_time?: string;
  room?: string;
  instructor?: string;
  section?: string;
}

export interface ScheduleFilters {
  course?: string;
  day?: string;
  room?: string;
  instructor?: string;
}
