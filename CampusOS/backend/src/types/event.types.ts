export interface Event {
  id: string;
  name: string;
  description: string;
  start_date: string;
  start_time: string;
  end_time: string;
  end_date: string;
  venue: string;
  organizer: string;
  capacity: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | 'full';
  created_at: Date;
  updated_at: Date;
}

export interface EventRegistration {
  event_id: string;
  student_id: string;
  student_name: string;
  registered_at: Date;
}

export interface EventWithDetails extends Event {
  registrations: EventRegistration[];
}

export interface CreateEventInput {
  id: string;
  name: string;
  description?: string;
  start_date: string;
  start_time: string;
  end_time: string;
  end_date: string;
  venue: string;
  organizer: string;
  capacity: number;
  registered?: number;
  status?: string;
}

export interface UpdateEventInput {
  name?: string;
  description?: string;
  start_date?: string;
  start_time?: string;
  end_time?: string;
  end_date?: string;
  venue?: string;
  organizer?: string;
  capacity?: number;
  registered?: number;
  status?: string;
}

export interface EventFilters {
  status?: string;
  venue?: string;
  organizer?: string;
  date?: string;
}

export interface CreateRegistrationInput {
  event_id: string;
  student_id: string;
  student_name: string;
}
